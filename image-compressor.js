// image-compressor.js - Reusable utility to compress images into high-detail thumbnails
export async function compressImageToThumbnail(base64Str, maxWidth = 128, maxHeight = 128, quality = 0.8) {
    if (!base64Str || !base64Str.startsWith('data:image/')) {
        return base64Str; // Return as-is if it's an emoji or non-image string
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            // Enable smooth image scaling for high fidelity
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, 0, 0, width, height);

            // Export with higher quality setting (80%)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
        };
        img.onerror = () => {
            resolve(base64Str);
        };
    });
}
