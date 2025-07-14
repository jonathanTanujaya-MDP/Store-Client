import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="dialog-button confirm-button">Confirm</button>
          <button onClick={onCancel} className="dialog-button cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;