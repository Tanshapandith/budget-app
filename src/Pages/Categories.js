import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditCategoryModal from "./EditCategoryModal"; 
import "./Category.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const userId = localStorage.getItem("userId");

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}.json`
      );
      const data = await response.json();

      if (data) {
        const categoryList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setCategories(categoryList);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal (add or edit)
  const handleOpenModal = (category = null) => {
    setEditData(category);
    setModalOpen(true);
  };

  // Save category (add or edit)
  const handleSaveCategory = async (category) => {
    try {
      if (editData) {
        // Edit
        await fetch(
          `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}/${editData.id}.json`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
          }
        );
      } else {
        // Add
        await fetch(
          `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}.json`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
          }
        );
      }

      fetchCategories(); // Refresh data
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // Delete category
  const handleDelete = async (categoryId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(
          `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}/${categoryId}.json`,
          { method: "DELETE" }
        );
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories(); // Refresh
      } catch (error) {
        Swal.fire("Error", "Failed to delete category.", "error");
      }
    }
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h2>📂 Categories</h2>
        <button className="add-btn" onClick={() => handleOpenModal(null)}>
          + Add New Category
        </button>
      </div>

      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.title}</td>
                  <td>{cat.type}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      <EditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editData}
      />
    </div>
  );
}
