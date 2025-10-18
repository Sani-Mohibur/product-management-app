"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-space bg-opacity-75">
      {/* Modal Content */}
      <div className="w-full max-w-md rounded-lg bg-ghost-white/10 p-6 shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-bold text-ghost-white">{title}</h2>
        <p className="mt-2 text-ghost-white/80">{message}</p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-md bg-tan-hide/80 px-4 py-2 font-semibold text-dark-space transition hover:bg-tan-hide"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-burnt-sienna px-4 py-2 font-semibold text-ghost-white transition hover:bg-burnt-sienna/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
