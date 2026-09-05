import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { fetchImages, uploadImage, deleteImage } from './api';
import UploadDropzone from './components/UploadDropzone';
import ImageCard from './components/ImageCard';
import Lightbox from './components/Lightbox';
import Toast from './components/Toast';

function App() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const [deletingName, setDeletingName] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadImages = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchImages();
      setImages(data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      notify(err.message, 'error');
    }
  }, [notify]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleUpload = async (file, validationError) => {
    if (validationError) {
      notify(validationError, 'error');
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const image = await uploadImage(file, setProgress);
      setImages((prev) => [image, ...prev]);
      notify('Image uploaded.');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (image) => {
    setDeletingName(image.name);
    try {
      await deleteImage(image.name);
      setImages((prev) => prev.filter((item) => item.name !== image.name));
      notify('Image removed.');
      if (activeImage?.name === image.name) setActiveImage(null);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setDeletingName(null);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Self-hosted</p>
          <h1>Lumen Gallery</h1>
          <p className="app__subtitle">Upload, browse, and manage your images from any device.</p>
        </div>
        <span className="app__count">
          {status === 'ready' ? `${images.length} ${images.length === 1 ? 'image' : 'images'}` : ''}
        </span>
      </header>

      <UploadDropzone onUpload={handleUpload} uploading={uploading} progress={progress} />

      <main>
        {status === 'loading' && (
          <div className="grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="card card--skeleton" key={index} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="empty-state">
            <h2>Couldn&apos;t load the gallery</h2>
            <p>Check that the API server is running, then try again.</p>
            <button onClick={loadImages}>Retry</button>
          </div>
        )}

        {status === 'ready' && images.length === 0 && (
          <div className="empty-state">
            <h2>No images yet</h2>
            <p>Drop a photo above to start your gallery.</p>
          </div>
        )}

        {status === 'ready' && images.length > 0 && (
          <div className="grid">
            {images.map((image) => (
              <ImageCard
                key={image.name}
                image={image}
                onView={setActiveImage}
                onDelete={handleDelete}
                deleting={deletingName === image.name}
              />
            ))}
          </div>
        )}
      </main>

      <Lightbox image={activeImage} onClose={() => setActiveImage(null)} />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

export default App;
