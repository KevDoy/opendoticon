export class IconLoader {
    async loadIconFile(file) {
        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            
            // Find the icon.json file in any subdirectory
            const jsonFile = Object.values(contents.files).find(file => 
                file.name.endsWith('icon.json')
            );

            if (!jsonFile) {
                throw new Error("icon.json not found in .icon file");
            }

            // Parse the JSON data
            const jsonContent = await jsonFile.async("string");
            const iconData = JSON.parse(jsonContent);

            // Validate layer metadata
            if (iconData.groups) {
                iconData.groups.forEach((group, groupIndex) => {
                    if (group.layers) {
                        group.layers.forEach((layer, layerIndex) => {
                            // Log layer metadata for debugging
                            console.log(`Layer ${layerIndex} in group ${groupIndex}:`, {
                                name: layer.name,
                                'blend-mode': layer['blend-mode'],
                                'fill-specializations': layer['fill-specializations']
                            });
                        });
                    }
                });
            }

            // Load assets (SVG and JPG/JPEG)
            const assets = {};
            const assetPromises = [];

            // Find all asset files in any Assets directory
            for (const [path, zipEntry] of Object.entries(contents.files)) {
                if (path.includes('Assets/')) {
                    const fileName = path.split('/').pop();
                    console.log(`Processing asset: ${fileName}`);

                    if (fileName.endsWith('.svg')) {
                        // Load SVG as text
                        assetPromises.push(
                            zipEntry.async("string").then(content => {
                                assets[fileName] = content;
                                console.log(`Loaded SVG: ${fileName}`);
                            })
                        );
                    } else if (fileName.toLowerCase().endsWith('.jpg') || 
                             fileName.toLowerCase().endsWith('.jpeg') ||
                             fileName.toLowerCase().endsWith('.png')) {
                        // Load binary files (JPG/PNG) as uint8array
                        assetPromises.push(
                            zipEntry.async("uint8array").then(content => {
                                assets[fileName] = content;
                                console.log(`Loaded binary file: ${fileName}, size: ${content.length} bytes`);
                            })
                        );
                    }
                }
            }

            await Promise.all(assetPromises);
            console.log("Loaded assets:", Object.keys(assets));
            console.log("Final metadata structure:", JSON.stringify(iconData, null, 2));

            return {
                metadata: iconData,
                assets: assets
            };
        } catch (error) {
            console.error("Error processing .icon file:", error);
            throw error;
        }
    }
}