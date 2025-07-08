using Colossal.UI.Binding;
using Game.UI;

namespace CustomizableMenu
{
    public partial class CustomizableMenuUISystem : UISystemBase
    {
        protected override void OnCreate()
        {
            base.OnCreate();

            AddUpdateBinding(new GetterValueBinding<bool>(CustomizableMenu.Id, "enabled", () => CustomizableMenu.Setting.Enabled));
            AddUpdateBinding(new GetterValueBinding<bool>(CustomizableMenu.Id, "activateEmbedRules",
                () => CustomizableMenu.Setting.ActivateEmbedRules));
            AddUpdateBinding(new GetterValueBinding<bool>(CustomizableMenu.Id, "protectVanillaMenu",
                () => CustomizableMenu.Setting.ProtectVanillaMenu));
        }
    }
}