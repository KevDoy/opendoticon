export class IconLoader {
    async loadIconFile(file) {
        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            console.log('Zip contents:', contents.files);
            
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
            console.log("Parsed JSON:", iconData);

            // Load SVG assets
            const assets = {};
            const assetPromises = [];

            // Find all SVG files in any Assets directory
            for (const [path, zipEntry] of Object.entries(contents.files)) {
                if (path.includes('Assets/') && path.endsWith('.svg')) {
                    const fileName = path.split('/').pop();
                    assetPromises.push(
                        zipEntry.async("string").then(content => {
                            assets[fileName] = content;
                        })
                    );
                }
            }

            await Promise.all(assetPromises);
            console.log("Loaded assets:", Object.keys(assets));

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