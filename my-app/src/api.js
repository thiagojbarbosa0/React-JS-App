const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function parseOrThrow(response) {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = (body && body.error) || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }
  return body;
}

export async function fetchImages() {
  const response = await fetch(`${API_URL}/api/images`);
  const data = await parseOrThrow(response);
  return data.images;
}

export async function uploadImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/api/images`);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.image);
        } else {
          reject(new Error(data.error || 'Upload failed.'));
        }
      } catch (err) {
        reject(new Error('Unexpected response from the server.'));
      }
    };

    xhr.onerror = () => reject(new Error('Could not reach the server. Is it running?'));
    xhr.send(formData);
  });
}

export async function deleteImage(name) {
  const response = await fetch(`${API_URL}/api/images/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
  await parseOrThrow(response);
}

export function resolveImageUrl(url) {
  return `${API_URL}${url}`;
}
