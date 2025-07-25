using Colossal;
using Colossal.IO.AssetDatabase;
using Colossal.IO.AssetDatabase.Internal;
using Game.Modding;
using Game.Settings;
using Game.UI;
using Game.UI.Widgets;
using System.Collections.Generic;

namespace CustomizableMenu
{
    [FileLocation(@"ModsSettings\Nullpinter\CustomizableMenu")]
    public class Setting : ModSetting
    {
        public Setting(IMod mod) : base(mod)
        {
            SetDefaults();
        }

        public bool Enabled { get; set; }
        public bool ProtectVanillaMenu { get; set; }
        public bool ActivateEmbedRules { get; set; }

        public sealed override void SetDefaults()
        {
            Enabled = true;
            ProtectVanillaMenu = false;
            ActivateEmbedRules = true;
        }
    }

    public class LocaleEN : IDictionarySource
    {
        private readonly Setting _setting;

        public LocaleEN(Setting setting)
        {
            _setting = setting;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors,
            Dictionary<string, int> indexCounts)
        {
            return new Dictionary<string, string>
            {
                {_setting.GetSettingsLocaleID(), "Customizable Menu"},
                {"CustomizableMenu.ALPHA", "ALPHA"},
                {"CustomizableMenu.RC", "RC"},
                {"CustomizableMenu.EXP", "EXP"},
                {"CustomizableMenu.BROKEN", "BROKEN"},
                {_setting.GetOptionLabelLocaleID(nameof(_setting.Enabled)), "Enabled"},
                {_setting.GetOptionDescLocaleID(nameof(_setting.Enabled)), "Enable Customizable Menu"},
                {_setting.GetOptionLabelLocaleID(nameof(_setting.ProtectVanillaMenu)), "Protect Vanilla Menu"},
                {_setting.GetOptionDescLocaleID(nameof(_setting.ProtectVanillaMenu)), "When enabled, vanilla tabs will be immutable."},
                {_setting.GetOptionLabelLocaleID(nameof(_setting.ActivateEmbedRules)), "Activate Embed Rules"},
                {_setting.GetOptionDescLocaleID(nameof(_setting.ActivateEmbedRules)), "Activate the Embed Rules"}
            };
        }

        public void Unload()
        {
        }
    }
}