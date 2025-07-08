using Colossal.IO.AssetDatabase;
using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;

namespace CustomizableMenu
{
    public class CustomizableMenu : IMod
    {
        public static string Id = "CustomizableMenu";
        public static ILog Logger = LogManager.GetLogger($"{nameof(CustomizableMenu)}").SetShowsErrorsInUI(false);
        public static Setting Setting;

        public void OnLoad(UpdateSystem updateSystem)
        {
            Logger.Info(nameof(OnLoad));

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
                Logger.Info($"Current mod asset at {asset.path}");

            Setting = new Setting(this);
            Setting.RegisterInOptionsUI();
            GameManager.instance.localizationManager.AddSource("en-US", new LocaleEN(Setting));

            AssetDatabase.global.LoadSettings(nameof(CustomizableMenu), Setting, new Setting(this));
            updateSystem.UpdateAt<CustomizableMenuUISystem>(SystemUpdatePhase.UIUpdate);
        }

        public void OnDispose()
        {
            Logger.Info(nameof(OnDispose));
            if (Setting == null) return;
            Setting.UnregisterInOptionsUI();
            Setting = null;
        }
    }
}
