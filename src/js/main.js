import { IconLoader } from './iconLoader.js';
import { IconCanvas } from './canvas.js';

document.addEventListener('DOMContentLoaded', () => {
    const iconLoader = new IconLoader();
    const canvas = new IconCanvas(document.getElementById('iconCanvas'));
    
    document.getElementById('iconFileInput').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const iconData = await iconLoader.loadIconFile(file);
                console.log('Loaded icon data:', iconData);
                await canvas.drawIcon(iconData);
            } catch (error) {
                console.error('Error loading icon:', error);
                alert(`Error loading icon file: ${error.message}`);
            }
        }
    });

    // Export button handler
    document.getElementById('exportButton').addEventListener('click', () => {
        canvas.exportToPNG();
    });
});