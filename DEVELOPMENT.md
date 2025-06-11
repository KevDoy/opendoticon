# Icon Viewer Development

## Features
- Loads and parses .icon files
- Displays icon with proper border radius
- Handles multiple asset layers (SVGs, JPGs, and PNGs) with correct z-ordering
- Supports point-based translations
- Maintains SVG aspect ratios
- Exports to PNG at 2048x2048 resolution
- Supports different color spaces (sRGB, Display P3)
- Applies SVG fills from icon data
- Implements shadow effects
- Handles fill specializations (none, automatic)
- Glass overlay effect (for icon, not assets)

## Implementation Details

### Canvas Setup
- Canvas size: 2048x2048 pixels (2x resolution)
- Corner radius: ~538px (0.30590926 * canvas width)
- Background: Supports solid colors, gradients, and automatic fills
- Glass overlay texture on all rendered icons

### SVG Rendering
- Preserves original aspect ratios
- Scales based on natural SVG dimensions
- Supports translation in points (converted to pixels)
- Handles different viewBox configurations
- Applies custom fills to SVG elements
- Respects fill specializations

### Image Layer Support
- Handles SVG, JPG, and PNG formats
- Maintains aspect ratios for all image types
- Proper binary data handling for raster images

### Shadow Effects
- Supports neutral shadows
- Configurable shadow opacity
- Multi-layer shadow composition

### UI Components
- File input for .icon files
- Export button for PNG output
- Responsive canvas container

## Future Improvements
- Support for translucency
- Better error handling for malformed SVGs
- Layer opacity support
- Additional export options
- Layer blend modes implementation
- Platform-specific shape support
- Dark-mode specific colors and settings

## Known Issues
- Blend modes not working correctly
- PNG files may have loading issues
- Multiple icon loads may need canvas clearing improvement
- Glass overlay path might need adjustment based on deployment

## Project Structure
```
src/
  ├── js/
  │   ├── canvas.js
  │   ├── iconLoader.js
  │   └── main.js
  ├── css/
  │   └── styles.css
  ├── img/
  │   └── glass-overlay.png
  └── index.html
```

## Dependencies
- JSZip for .icon file parsing
- Native Canvas API for rendering
- Web File API for file handling

## Development Setup
1. Clone the repository
2. Ensure all assets are in correct directories
3. Use a local server for development (e.g., `python -m http.server`)
4. Test with various icon files