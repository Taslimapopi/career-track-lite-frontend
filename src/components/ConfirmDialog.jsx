import { useEffect } from "react";
import { buttonStyles } from "./Button";

const ConfirmDialog = ({ open, title, description, onConfirm, onCancel, confirmLabel = "Delete" }) => {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onCancel();
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className={buttonStyles("secondary")}>
            Cancel
          </button>
          <button onClick={onConfirm} className={buttonStyles("danger")}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;