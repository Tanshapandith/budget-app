import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate("/add-category");
  };

  useEffect(() => {
   
const userId = localStorage.getItem("userId");
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

    fetchCategories();
  }, []);

  return (
    <div className="category-page">
      <div className="category-header">
        <h2>📂 Categories</h2>
        <button className="add-btn" onClick={handleAddCategory}>
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
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
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
    </div>
  );
}
