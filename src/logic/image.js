// src/logic/image.js
// Prepares a screenshot for the AI: checks it, shrinks it and converts it to base64.

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB before shrinking
const MAX_SIDE = 1600; // pixels

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_LOAD_FAILED'));
    };

    image.src = url;
  });
}

// Returns { data, mimeType } where data is base64 without the "data:" prefix.
export async function prepareImage(file) {
  if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('IMAGE_TYPE');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('IMAGE_TOO_BIG');
  }

  const image = await loadImage(file);

  const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

  return {
    data: dataUrl.split(',')[1],
    mimeType: 'image/jpeg'
  };
}