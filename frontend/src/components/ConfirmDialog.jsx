import React from "react";
import Modal from "./Modal";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="confirm-dialog">
      <h3>{title || "Are you sure?"}</h3>
      <p>{message}</p>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
