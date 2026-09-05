import { useEffect } from 'react';

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => onDismiss(), 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`} role="status">
      {toast.message}
    </div>
  );
}

export default Toast;
