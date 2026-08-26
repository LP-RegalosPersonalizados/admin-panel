import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, title, message, confirmLabel, cancelLabel, variant = 'default', onConfirm, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="text-[#6e6e73] dark:text-[#86868b] text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel || 'Cancelar'}
        </Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmLabel || 'Confirmar'}
        </Button>
      </div>
    </Modal>
  );
}
