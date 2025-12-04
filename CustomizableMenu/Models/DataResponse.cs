using System.Collections.Generic;

namespace CustomizableMenu.Models;

using J = Newtonsoft.Json.JsonPropertyAttribute;

public partial class DataResponse
{
    [J("duration")] public long Duration { get; set; }
    [J("data")] public Dictionary<string, CustomData> Data { get; set; }
}

public class CustomData
{
    [J("badge")]
    public bool? Badge { get; set; }

    [J("srcs")]
    public List<string>? Srcs { get; set; }

    [J("style")]
    public Dictionary<string, object>? Style { get; set; }

    [J("item")]
    public ItemData? Item { get; set; }

    [J("beta")]
    public bool? Beta { get; set; }

    [J("warning")]
    public bool? Warning { get; set; }
}

public class ItemData
{
    [J("builtIn")]
    public bool? BuiltIn { get; set; }
}