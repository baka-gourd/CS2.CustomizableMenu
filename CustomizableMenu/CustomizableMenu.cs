#nullable enable
using Colossal.Core;
using Colossal.IO.AssetDatabase;
using Colossal.Logging;

using Game;
using Game.Modding;
using Game.SceneFlow;

using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Colossal.PSI.Environment;
using CustomizableMenu.Models;
using Newtonsoft.Json;

namespace CustomizableMenu
{
    public class CustomizableMenu : IMod
    {
        public const string Id = "CustomizableMenu";
        public static ILog Logger = LogManager.GetLogger($"{nameof(CustomizableMenu)}").SetShowsErrorsInUI(false);
        public static Setting? Setting;
        private static CancellationTokenSource _cts = new();
        private static readonly HttpClient Client =
            new(new HttpClientHandler
            {
                AutomaticDecompression =
                    DecompressionMethods.GZip | DecompressionMethods.Deflate
            })
            {
                Timeout = TimeSpan.FromSeconds(5)
            };

        public static string Data { get; private set; } = "{}";

        public void OnLoad(UpdateSystem updateSystem)
        {
            Logger.Info(nameof(OnLoad));

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
                Logger.Info($"Current mod asset at {asset.path}");

            Setting = new Setting(this);
            Setting.RegisterInOptionsUI();
            GameManager.instance.localizationManager.AddSource("en-US", new LocaleEN(Setting));

            AssetDatabase.global.LoadSettings(nameof(CustomizableMenu), Setting, new Setting(this));
            _ = InitializeData();
            updateSystem.UpdateAt<CustomizableMenuUISystem>(SystemUpdatePhase.UIUpdate);
        }

        public static void CancelOperation()
        {
            _cts.Cancel();
        }

        private static async Task<string?> GetOnlineSourceTextAsync(
            CancellationToken token)
        {
            try
            {
                using var response = await Client
                    .GetAsync(
                        Setting!.UpdateSource,
                        HttpCompletionOption.ResponseHeadersRead,
                        token
                    )
                    .ConfigureAwait(false);

                response.EnsureSuccessStatusCode();

                return await response.Content
                    .ReadAsStringAsync()
                    .ConfigureAwait(false);
            }
            catch (Exception)
            {
                return null;
            }
        }

        private static string GetSourceLocallyOrEmpty()
        {
            var path = Path.Combine(EnvPath.kUserDataPath, "ModsData", "Nullpinter", "CustomizableMenu", "cache.json");
            return !File.Exists(path) ? "{}" : File.ReadAllText(path);
        }

        private static string GetDataDirectory()
        {
            return Path.Combine(EnvPath.kUserDataPath, "ModsData", "Nullpinter", "CustomizableMenu");
        }

        private static string GetCachePath() => Path.Combine(GetDataDirectory(), "cache.json");

        private static string GetLockPath() => Path.Combine(GetDataDirectory(), "cache.lock.json");

        private static CacheLock? ReadCacheLock()
        {
            var lockPath = GetLockPath();
            if (!File.Exists(lockPath))
            {
                return null;
            }

            try
            {
                var text = File.ReadAllText(lockPath);
                return JsonConvert.DeserializeObject<CacheLock>(text);
            }
            catch
            {
                return null;
            }
        }

        private static async Task WriteCacheAndLockAsync(string res, long duration)
        {
            var dirPath = GetDataDirectory();
            var dir = new DirectoryInfo(dirPath);
            if (!dir.Exists)
            {
                dir.Create();
            }

            var cachePath = GetCachePath();
            var lockPath = GetLockPath();

            await File.WriteAllTextAsync(cachePath, res);

            var cacheLock = new CacheLock
            {
                Duration = duration,
                LastUpdatedUtc = DateTimeOffset.UtcNow
            };

            var lockJson = JsonConvert.SerializeObject(cacheLock);
            await File.WriteAllTextAsync(lockPath, lockJson);
        }

        public static async Task InitializeData(bool forceUpdate = false)
        {
            if (!forceUpdate)
            {
                var cacheLock = ReadCacheLock();
                if (cacheLock is not null)
                {
                    if (cacheLock.Duration == 0)
                    {
                        Data = GetSourceLocallyOrEmpty();
                        _cts = new CancellationTokenSource();
                        return;
                    }

                    var nextUpdateTime = cacheLock.LastUpdatedUtc.AddSeconds(cacheLock.Duration);
                    if (DateTimeOffset.UtcNow < nextUpdateTime)
                    {
                        Data = GetSourceLocallyOrEmpty();
                        _cts = new CancellationTokenSource();
                        return;
                    }
                }
            }

            var res = await GetOnlineSourceTextAsync(_cts.Token);
            if (res is null)
            {
                Data = GetSourceLocallyOrEmpty();
                _cts = new CancellationTokenSource();
                return;
            }

            var obj = JsonConvert.DeserializeObject<DataResponse>(res);
            var duration = obj?.Duration ?? 0;

            await WriteCacheAndLockAsync(res, duration);

            Data = GetSourceLocallyOrEmpty();
            _cts = new CancellationTokenSource();
        }

        public void OnDispose()
        {
            Logger.Info(nameof(OnDispose));
            CancelOperation();
            if (Setting == null) return;
            Setting.UnregisterInOptionsUI();
            Setting = null;
        }
    }

    internal class CacheLock
    {
        public long Duration { get; set; }

        public DateTimeOffset LastUpdatedUtc { get; set; }
    }
}