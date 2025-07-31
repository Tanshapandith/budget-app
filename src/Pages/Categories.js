import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import EditCategoryModal from "./EditCategoryModal";
import "./Category.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  // ✅ useCallback to satisfy ESLint
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // dependency added

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // ✅ now no warning

  const handleOpenModal = (category = null) => {
    setEditData(category);
    setModalOpen(true);
  };

  const handleSaveCategory = async (category) => {
    try {
      const url = editData
        ? `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}/${editData.id}.json`
        : `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}.json`;

      const method = editData ? "PATCH" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      fetchCategories();
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

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
        fetchCategories();
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
            {isLoading ? (
              <tr>
                <td colSpan="3">
                  <div className="loader">
                    <span className="loader-spinner"></span>
                  </div>
                </td>
              </tr>
            ) : categories.length > 0 ? (
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

      <EditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editData}
      />
    </div>
  );
}
