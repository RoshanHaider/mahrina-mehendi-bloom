import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function LogoZoom({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-cream/15 text-cream hover:bg-cream/25 z-10"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt="Mahrina logo full size"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-soft"
      />
    </div>,
    document.body
  );
}
