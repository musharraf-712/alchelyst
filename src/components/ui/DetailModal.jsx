import { useEffect } from "react";

export default function DetailModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
}