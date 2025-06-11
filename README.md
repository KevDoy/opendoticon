# openDotIcon - A viewer for Apple's .icon files

## Overview
The openDotIcon is a web application that allows users to open, view, and export Apple's .icon format. The project features a canvas that renders icons based on specifications provided in the icon file's JSON data.

## Features
- Opens and parses .icon files
- Renders icons at 2048x2048 resolution (2x)
- Displays icon with proper border radius (~538px)
- Handles multiple asset layers (SVG, JPG, PNG) with correct z-ordering
- Supports SVG translations and scaling
- Preserves asset aspect ratios
- Supports various color formats (sRGB, Display P3)
- Implements shadow effects with configurable opacity
- Applies SVG fills from icon data
- Handles fill specializations (none, automatic)
- Exports to high-resolution PNG
- Glass overlay effect on rendered icons

## Technical Implementation

### Canvas Setup
- Canvas size: 2048x2048 pixels (2x resolution)
- Corner radius: ~538px (0.30590926 * canvas width)
- Background: Supports solid colors, gradients, and automatic fills
- Glass overlay texture on all rendered icons

### Asset Handling
- SVG: Preserves aspect ratios, handles viewBox configurations
- JPG/PNG: Maintains original dimensions, proper binary data handling
- Supports point-based translations (converted to pixels)
- Multi-layer shadow composition
- Custom fill application for SVG elements

## Project Structure
```
src/
  ├── js/
  │   ├── canvas.js      # Canvas rendering and drawing operations
  │   ├── iconLoader.js  # Icon file parsing and asset loading
  │   └── main.js        # Application entry point and UI handlers
  ├── css/
  │   └── styles.css     # Application styling
  ├── img/
  │   └── glass-overlay.png  # Glass effect overlay texture
  └── index.html         # Main application page
```

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
      },
      "fill-specializations": [
        {
          "value": "none"                  // Use original colors
        },
        {
          "appearance": "dark",
          "value": "automatic"             // System-determined color
        }
      ]
    }],
    "shadow": {
      "kind": "neutral",                   // Shadow type
      "opacity": 0.5                       // Shadow opacity
    }
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
    }],
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
2. Ensure all project assets are in their correct directories
3. Use a local web server for development:
   ```bash
   python3 -m http.server
   ```
4. Navigate to `http://localhost:8000` in your browser

The site is static and can be deployed on GitHub Pages or any web server.

## Known Issues
- Blend modes not currently working
- PNG files may have loading issues
- Multiple icon loads may need canvas clearing improvement
- Glass overlay path might need adjustment based on deployment

## Dependencies
- JSZip for .icon file parsing
- Native Canvas API for rendering
- Web File API for file handling

## Development
For development setup and additional technical details, see [DEVELOPMENT.md](DEVELOPMENT.md)

## License
This project is licensed under the MIT License. See the LICENSE file for more details.