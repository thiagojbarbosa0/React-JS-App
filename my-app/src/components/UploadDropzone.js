import { useCallback, useRef, useState } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function UploadDropzone({ onUpload, uploading, progress }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList && fileList[0];
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        onUpload(null, 'That file type is not supported. Use JPG, PNG, GIF or WEBP.');
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={`dropzone ${isDragging ? 'dropzone--active' : ''} ${uploading ? 'dropzone--busy' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      {uploading ? (
        <div className="dropzone__progress">
          <div className="progress-ring" style={{ '--progress': `${progress}%` }}>
            <span>{progress}%</span>
          </div>
          <p>Uploading&hellip;</p>
        </div>
      ) : (
        <>
          <svg className="dropzone__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M24 6v24m0-24 9 9m-9-9-9 9M8 32v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="dropzone__title">Drop an image here, or click to browse</p>
          <p className="dropzone__hint">JPG, PNG, GIF or WEBP — up to 8MB</p>
        </>
      )}
    </div>
  );
}

export default UploadDropzone;
