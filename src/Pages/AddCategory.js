import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Category.css";

export default function AddCategory() {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire("Error", "Title cannot be empty", "error");
      return;
    }
        
    const userId =  localStorage.getItem("userId");
    try {
      const res = await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}.json`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, type }),
        }
      );

      if (!res.ok) throw new Error("Failed to save");

      Swal.fire("Success", "Category added successfully!", "success");
      navigate("/categories");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not save category", "error");
    }
  };

  return (
    <div className="add-category-page">
      <div className="form-card">
        <h2>Create a New Category</h2>
        <div className="type-toggle">
          <button
            type="button"
            className={type === "expense" ? "active" : ""}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={type === "income" ? "active" : ""}
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
