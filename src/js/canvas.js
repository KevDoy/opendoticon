export class IconCanvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        // Set physical pixel size to 2048x2048
        this.canvas.width = 2048;
        this.canvas.height = 2048;
        this.ctx = canvasElement.getContext('2d');
        
        // Add debug logging for canvas setup
        console.log('Canvas initialized:', {
            width: this.canvas.width,
            height: this.canvas.height,
            dpr: window.devicePixelRatio,
            style: {
                width: this.canvas.style.width,
                height: this.canvas.style.height
            }
        });
        
        // Calculate exact multiplier radius
        this.cornerRadius = Math.round(this.canvas.width * 0.30590926);
        
        // Add debug logging for corner radius
        console.log('Corner radius:', {
            multiplier: 0.2626953125,
            calculatedRadius: this.cornerRadius,
            targetRadius: 538
        });
        
        this.setupRoundedCanvas();
        this.drawDefaultBackground();
    }

    createRoundedPath(ctx) {
        const radius = this.cornerRadius;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(ctx.canvas.width - radius, 0);
        ctx.quadraticCurveTo(ctx.canvas.width, 0, ctx.canvas.width, radius);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - radius);
        ctx.quadraticCurveTo(ctx.canvas.width, ctx.canvas.height, ctx.canvas.width - radius, ctx.canvas.height);
        ctx.lineTo(radius, ctx.canvas.height);
        ctx.quadraticCurveTo(0, ctx.canvas.height, 0, ctx.canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
    }

    setupRoundedCanvas() {
        this.createRoundedPath(this.ctx);
        this.ctx.clip();
    }

    drawAutomaticBackground() {
        // Create gradient from white to light gray
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        // Convert the RGB values to strings
        const topColor = 'rgba(255, 255, 255, 1)';
        const bottomColor = 'rgba(235, 235, 235, 1)';
        
        gradient.addColorStop(0, topColor);
        gradient.addColorStop(1, bottomColor);

        // Apply gradient
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.restore();
    }

    // Add method for initial background
    drawDefaultBackground() {
        this.drawAutomaticBackground();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    convertColorToRGBA(colorString) {
        // First, determine the color space and values
        const [colorSpace, values] = colorString.split(':');
        const [r, g, b, a = 1] = values.split(',').map(Number);

        switch (colorSpace) {
            case 'extended-srgb':
                return this.convertSRGBtoRGB(r, g, b, a);
            case 'display-p3':
                return this.convertP3toRGB(r, g, b, a);
            case 'extended-gray':
                return this.convertGrayToRGB(r, a);
            default:
                console.warn(`Unknown color space: ${colorSpace}, falling back to sRGB`);
                return this.convertSRGBtoRGB(r, g, b, a);
        }
    }

    convertGrayToRGB(whiteValue, alpha) {
        // Convert the white value (0-1) to RGB
        // 0 = black (0,0,0)
        // 1 = white (255,255,255)
        const value = Math.round(whiteValue * 255);
        return {
            r: value,
            g: value,
            b: value,
            a: alpha
        };
    }

    convertSRGBtoRGB(r, g, b, a) {
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
            a: a
        };
    }

    convertP3toRGB(r, g, b, a) {
        // P3 to sRGB conversion matrix
        const p3ToRGB = [
            [ 1.2249, -0.2247, -0.0002],
            [-0.0420,  1.0420,  0.0000],
            [-0.0197, -0.0786,  1.0983]
        ];

        // Convert P3 to sRGB
        const sR = p3ToRGB[0][0] * r + p3ToRGB[0][1] * g + p3ToRGB[0][2] * b;
        const sG = p3ToRGB[1][0] * r + p3ToRGB[1][1] * g + p3ToRGB[1][2] * b;
        const sB = p3ToRGB[2][0] * r + p3ToRGB[2][1] * g + p3ToRGB[2][2] * b;

        // Clamp values between 0-1
        const clamp = x => Math.max(0, Math.min(1, x));

        return {
            r: Math.round(clamp(sR) * 255),
            g: Math.round(clamp(sG) * 255),
            b: Math.round(clamp(sB) * 255),
            a: a
        };
    }

    createLighterColor(color) {
        // Create a lighter version of the color for the gradient top
        // The mathematical relationship appears to be:
        // - Add approximately 94 to R
        // - Add approximately 33 to G
        // - Keep B the same
        return {
            r: Math.min(255, color.r + 94),
            g: Math.min(255, color.g + 33),
            b: color.b,
            a: color.a
        };
    }

    drawGradientBackground(colorString) {
        const baseColor = this.convertColorToRGBA(colorString);
        const lighterColor = this.createLighterColor(baseColor);

        // Create gradient from top to bottom
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        // Add color stops
        gradient.addColorStop(0, `rgba(${lighterColor.r}, ${lighterColor.g}, ${lighterColor.b}, ${lighterColor.a})`);
        gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${baseColor.a})`);

        // Apply gradient
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.restore();
    }

    drawLinearGradient(gradientColors) {
        // Convert each color in the gradient array
        const colors = gradientColors.map(colorString => this.convertColorToRGBA(colorString));
        
        // Create gradient from top to bottom
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        // Add color stops evenly distributed
        colors.forEach((color, index) => {
            const stop = index / (colors.length - 1); // Evenly space stops between 0 and 1
            gradient.addColorStop(stop, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
        });

        // Apply gradient
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.restore();
    }

    exportToPNG() {
        try {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = this.canvas.width;
            exportCanvas.height = this.canvas.height;
            const exportCtx = exportCanvas.getContext('2d');

            // Use same rounded path as main canvas
            this.createRoundedPath(exportCtx);
            exportCtx.clip();
            
            // Draw the main canvas content onto export canvas
            exportCtx.drawImage(this.canvas, 0, 0);

            const dataUrl = exportCanvas.toDataURL('image/png');
            
            // Set up the download
            const link = document.createElement('a');
            link.download = 'icon-export.png';
            link.href = dataUrl;
            
            // Trigger the download
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            
            console.log('PNG export completed with rounded corners');
        } catch (error) {
            console.error('Error exporting PNG:', error);
        }
    }

    async drawIcon(iconData) {
        this.clear();
        
        // Draw background if fill is present
        const fill = iconData.metadata.fill;
        if (fill) {
            if (fill === 'automatic') {
                this.drawAutomaticBackground();
            } else if (fill['automatic-gradient']) {
                this.drawGradientBackground(fill['automatic-gradient']);
            } else if (fill['linear-gradient']) {
                this.drawLinearGradient(fill['linear-gradient']);
            } else if (fill['solid']) {
                const bgColor = this.convertColorToRGBA(fill['solid']);
                this.ctx.save();
                this.ctx.fillStyle = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`;
                this.ctx.fill();
                this.ctx.restore();
            }
        } else {
            // If no fill is specified, use automatic background
            this.drawAutomaticBackground();
        }

        // For each group in the icon data
        for (const group of iconData.metadata.groups) {
            // Reverse the layers array to draw in correct order
            const layers = [...group.layers].reverse();
            
            // For each layer in the group
            for (const layer of layers) {
                // Skip hidden layers
                if (layer.hidden) {
                    console.log(`Skipping hidden layer: ${layer.name}`);
                    continue;
                }

                const imageContent = iconData.assets[layer['image-name']];
                if (imageContent) {
                    await this.drawImageLayer(imageContent, layer, group);
                }
            }
        }
    }

    async drawShadowedSVG(svgContent, shadow, x, y, width, height) {
        console.log('Drawing shadow with settings:', shadow);
        
        // Create temporary canvas for shadow composition
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = this.canvas.width;
        shadowCanvas.height = this.canvas.height;
        const shadowCtx = shadowCanvas.getContext('2d');

        // Create a second canvas for overlay effect
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = this.canvas.width;
        overlayCanvas.height = this.canvas.height;
        const overlayCtx = overlayCanvas.getContext('2d');

        // Base shadow settings with adjusted multiplier (0.15 instead of 0.3)
        const baseOpacity = (shadow.opacity || 0.5) * 0.15;
        
        // Draw main shadow
        shadowCtx.save();
        shadowCtx.shadowColor = `rgba(0, 0, 0, ${baseOpacity})`;
        shadowCtx.shadowBlur = 40; // Increased blur for more softness
        shadowCtx.shadowOffsetY = 8;
        shadowCtx.shadowOffsetX = 8;

        // Draw overlay shadow (tighter, darker)
        overlayCtx.save();
        overlayCtx.shadowColor = `rgba(0, 0, 0, ${baseOpacity * 1.5})`; // 50% darker
        overlayCtx.shadowBlur = 20; // Tighter blur
        overlayCtx.shadowOffsetY = 4; // Half the offset
        overlayCtx.shadowOffsetX = 0;

        // Draw the content on both canvases
        const img = new Image();
        await new Promise((resolve) => {
            img.onload = () => {
                shadowCtx.drawImage(img, x, y, width, height);
                overlayCtx.drawImage(img, x, y, width, height);
                resolve();
            };
            img.src = svgContent;
        });

        shadowCtx.restore();
        overlayCtx.restore();

        // Composite both shadow layers onto main canvas
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(shadowCanvas, 0, 0);
        this.ctx.globalAlpha = 0.3; // Adjust overlay opacity
        this.ctx.drawImage(overlayCanvas, 0, 0);
        this.ctx.globalAlpha = 1;
    }

    async drawImageLayer(imageContent, layer, group) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = async () => {
                try {
                    let naturalWidth, naturalHeight;

                    if (layer['image-name'].toLowerCase().endsWith('.svg')) {
                        // SVG specific handling
                        const parser = new DOMParser();
                        const svgDoc = parser.parseFromString(imageContent, 'image/svg+xml');
                        const svgElement = svgDoc.documentElement;
                        naturalWidth = parseInt(svgElement.getAttribute('width')) || 120;
                        naturalHeight = parseInt(svgElement.getAttribute('height')) || 120;
                    } else {
                        // For PNG, JPG, and other bitmap images
                        naturalWidth = img.naturalWidth;
                        naturalHeight = img.naturalHeight;
                    }

                    // Calculate dimensions and position
                    const aspectRatio = naturalWidth / naturalHeight;
                    const scale = layer.position?.scale || 1;
                    const finalWidth = naturalWidth * scale * 2;
                    const finalHeight = finalWidth / aspectRatio;

                    // Calculate center position
                    const x = (this.canvas.width - finalWidth) / 2;
                    const y = (this.canvas.height - finalHeight) / 2;

                    // Apply translations
                    const [tx, ty] = layer.position?.['translation-in-points'] || [0, 0];
                    const pixelTranslateX = tx * 2;
                    const pixelTranslateY = ty * 2;

                    const finalX = x + pixelTranslateX;
                    const finalY = y + pixelTranslateY;

                    // Draw shadow first if group has shadow
                    if (group && group.shadow) {
                        await this.drawShadowedSVG(
                            img.src,
                            group.shadow,
                            finalX,
                            finalY,
                            finalWidth,
                            finalHeight
                        );
                    }

                    // Save the current canvas state
                    this.ctx.save();

                    // Apply blend mode if specified before drawing
                    if (layer['blend-mode']) {
                        const blendMode = layer['blend-mode'];
                        if (blendMode === 'overlay') {
                            // For overlay blend mode
                            this.ctx.globalCompositeOperation = 'overlay';
                        } else {
                            this.ctx.globalCompositeOperation = blendMode;
                        }
                    }

                    // Draw the actual image
                    this.ctx.drawImage(
                        img,
                        finalX,
                        finalY,
                        finalWidth,
                        finalHeight
                    );

                    // Restore the canvas state (this will reset blend mode)
                    this.ctx.restore();

                    URL.revokeObjectURL(img.src);
                    resolve();
                } catch (error) {
                    console.error('Error drawing layer:', error);
                    reject(error);
                }
            };

            img.onerror = (error) => {
                console.error('Error loading image:', error);
                reject(error);
            };

            // Initial image load
            if (layer['image-name'].toLowerCase().endsWith('.svg')) {
                const processedSVG = this.applySVGFill(imageContent, layer);
                const blob = new Blob([processedSVG], { type: 'image/svg+xml' });
                img.src = URL.createObjectURL(blob);
            } else {
                // Handle binary data for JPG/PNG
                const blob = new Blob([imageContent], { type: this.getImageMimeType(layer['image-name']) });
                img.src = URL.createObjectURL(blob);
            }
        });
    }

    getImageMimeType(filename) {
        const ext = filename.toLowerCase().split('.').pop();
        const mimeTypes = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml'
        };
        return mimeTypes[ext] || 'image/png';
    }

    applySVGFill(svgContent, layer) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');

        if (doc.querySelector('parsererror')) {
            console.error('SVG parsing error');
            return svgContent;
        }

        // Handle fills
        const elements = doc.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, g');

        elements.forEach(element => {
            if (layer['fill-specializations']) {
                const fillValue = layer['fill-specializations'][0].value;
                if (fillValue === 'none' || fillValue === 'automatic') {
                    // Don't modify the fill - keep original SVG colors
                    return;
                }
            } else if (layer.fill && layer.fill.solid) {
                const color = this.convertColorToRGBA(layer.fill.solid);
                element.setAttribute('fill', `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
            }
        });

        return new XMLSerializer().serializeToString(doc);
    }

    // Add this method to IconCanvas class
    getViewBoxFromSVG(svgContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svg = doc.documentElement;
        return svg.getAttribute('viewBox') || 'none';
    }
}

class SVGPathAnalyzer {
    constructor(svgContent) {
        this.parser = new DOMParser();
        this.svgDoc = this.parser.parseFromString(svgContent, "image/svg+xml");
    }

    getOuterPaths() {
        // Get all path elements
        const paths = this.svgDoc.querySelectorAll('path');
        const outerPaths = [];

        paths.forEach(path => {
            const d = path.getAttribute('d');
            const bbox = path.getBBox();
            
            // Store path data and its bounding box
            outerPaths.push({
                pathData: d,
                bounds: bbox,
                fill: path.getAttribute('fill')
            });
        });

        return outerPaths;
    }
}

