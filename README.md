# openDotIcon - A viewer for Apple's .icon files

## Overview
The openDotIcon is a web application that allows users to open, view, and export Apple's .icon format. The project features a canvas that renders icons based on specifications provided in the icon file's JSON data.

## Features
- Opens and parses .icon files
- Renders icons at 2048x2048 resolution (2x)
- Only SVG, PNG, and JPG based assets are currently supported
- Supports multiple SVG layers with z-ordering
- Handles SVG translations and scaling
- Preserves SVG aspect ratios
- Supports various color formats (sRGB, Display P3)
- Exports to high-resolution PNG

## JSON Structure
The .icon format uses a JSON structure with these key properties:

### Implemented Features
```json
{
  "fill": {
    "solid": "srgb:r,g,b,a",              // Solid background color
    "linear-gradient": ["color1", "color2"], // Gradient background
    "automatic-gradient": "color"          // System-generated gradient
  },
  "groups": [{
    "layers": [{
      "image-name": "example.svg",         // Reference to SVG asset
      "name": "layer-name",                // Display name of layer
      "position": {
        "scale": 1.0,                      // Scale factor (1.0 = 100%)
        "translation-in-points": [x, y]     // Offset in points from center
      },
      "fill": {
        "solid": "color-space:r,g,b,a"     // Layer-specific color fill
      }
    }]
  }]
}
```

### Unimplemented Properties
```json
{
  "groups": [{
    "layers": [{
      "blend-mode": "overlay",             // Layer blend mode
      "glass": true                        // Glass effect toggle
    }],,
    "translucency": {
      "enabled": true,                     // Layer translucency toggle
      "value": 0.5                         // Translucency amount
    }
  }],
  "supported-platforms": {
    "circles": ["watchOS"],                // Platform-specific shapes
    "squares": "shared"                    // Shared across platforms
  }
}
```

## Setup Instructions
1. Clone the repository
2. Add the files to any web server
3. Navigate to index.html

The site is static, and can be deployed on GitHub Pages.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
