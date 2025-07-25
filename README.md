# CustomizableMenu for Cities: Skylines 2

A lightweight yet powerful mod that enhances menu items in the Cities: Skylines 2 user interface.

## Overview

CustomizableMenu provides a framework for mod developers to enhance the game's menu system with custom badges, styling, indicators, and more. It seamlessly integrates with the existing UI while offering a flexible API that makes menu customization straightforward and accessible.

## Usage for Mod Developers

### Accessing the Utility Functions

To use the CustomizableMenu in your mod, import the `getModuleComponent` function and access the utility functions:

```typescript
import { Component, ComponentType } from "react";

// Import getModuleComponent from CS2's modding API
type Component<Props = any> = ComponentType<Props>;
export const getModuleComponent = <Props = any>(
    modulePath: string,
    exportName: string
) => getModule(modulePath, exportName) as Component<Props>;

// Get utility functions from CustomizableMenu individually
const getCustomData = getModuleComponent("customizable-menu/utils.ts", "getCustomData");
const setCustomData = getModuleComponent("customizable-menu/utils.ts", "setCustomData");
const hasCustomData = getModuleComponent("customizable-menu/utils.ts", "hasCustomData");
const removeCustomData = getModuleComponent("customizable-menu/utils.ts", "removeCustomData");
```

### Customizing Menu Items

The `CustomData` interface allows you to customize various aspects of menu items:

```typescript
interface CustomData {
    badge?: boolean;      // Whether to show a badge
    srcs?: string[];      // Custom image sources for badges
    style?: CSSProperties; // Custom CSS styling
    item?: { 
        builtIn?: boolean // Whether the item is built-in
    };
    beta?: boolean;       // Whether to show a beta indicator
    warning?: boolean;    // Whether to show a warning indicator
}
```

### Example: Adding a Custom Badge to a Menu Item

```typescript
import { CSSProperties } from "react";

// Get utility function
const setCustomData = getModuleComponent("customizable-menu/utils.ts", "setCustomData");

// Create custom data for a menu item
const customStyle: CSSProperties = {
    backgroundColor: "#3498db",
    color: "white",
    fontWeight: "bold"
};

// Set custom data for a menu item with ID "MyModSettings"
setCustomData("MyModSettings", {
    badge: true,
    srcs: ["EXP"],  // Will display badges with these texts
    style: customStyle,
    beta: true,  // Will show a beta indicator
    warning: false
});
```

### Example: Checking for Custom Data

```typescript
// Get utility functions
const hasCustomData = getModuleComponent("customizable-menu/utils.ts", "hasCustomData");
const getCustomData = getModuleComponent("customizable-menu/utils.ts", "getCustomData");

// Check if a menu item has custom data
if (hasCustomData("MyModSettings")) {
    // Get the custom data
    const data = getCustomData("MyModSettings");
    console.log("Custom data:", data);
}
```

### Example: Removing Custom Data

```typescript
// Get utility function
const removeCustomData = getModuleComponent("customizable-menu/utils.ts", "removeCustomData");

// Remove custom data from a menu item
removeCustomData("MyModSettings");
```

## Customization Options

### Badge Types

You can use predefined badge types or create custom ones:

- **Predefined types**: `"ALPHA"`, `"RC"`, `"EXP"`, `"BROKEN"`, `"BETA"`
- **Custom types**: Any string value that doesn't match a predefined type

### Styling

Use React's CSSProperties to customize the appearance of your badges:

```typescript
const customStyle: CSSProperties = {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px"
};
```

## Configuration

The mod provides two key configuration options:

1. **`enabled`**: Toggle the mod functionality on or off
2. **`protectVanillaMenu`**: When enabled, prevents modifications to built-in menu items (General, Graphics, Gameplay, etc.)
