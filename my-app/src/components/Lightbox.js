import { useEffect } from 'react';
import { resolveImageUrl } from '../api';

function Lightbox({ image, onClose }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <img
        src={resolveImageUrl(image.url)}
        alt=""
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export default Lightbox;
