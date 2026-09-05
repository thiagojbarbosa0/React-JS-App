import { resolveImageUrl } from '../api';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ImageCard({ image, onView, onDelete, deleting }) {
  return (
    <figure className={`card ${deleting ? 'card--removing' : ''}`}>
      <button className="card__frame" onClick={() => onView(image)} aria-label={`Open ${image.name}`}>
        <img src={resolveImageUrl(image.url)} alt="" loading="lazy" />
      </button>
      <figcaption className="card__meta">
        <span>{formatDate(image.uploadedAt)}</span>
        <span>{formatSize(image.size)}</span>
        <button
          className="card__delete"
          onClick={() => onDelete(image)}
          aria-label={`Delete ${image.name}`}
          disabled={deleting}
        >
          Remove
        </button>
      </figcaption>
    </figure>
  );
}

export default ImageCard;
