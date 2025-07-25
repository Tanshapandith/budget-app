import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./EditCategoryModal.css";

export default function EditCategoryModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({ type: "Expense", title: "" });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onClose();

    Swal.fire({
      icon: "success",
      title: initialData ? "Updated!" : "Added!",
      text: `Category ${initialData ? "updated" : "added"} successfully!`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{initialData ? "✏️ Edit Category" : "➕ Add Category"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">
              {initialData ? "Update" : "Add"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
