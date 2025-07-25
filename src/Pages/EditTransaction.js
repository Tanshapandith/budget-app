import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./Addtransaction.css";

export default function EditTransaction() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    note: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTransaction = async () => {
      const res = await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}/${id}.json`
      );
      const data = await res.json();
      if (data) setFormData(data);
    };

    fetchTransaction();
  }, [id, userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}/${id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      Swal.fire("Updated!", "Transaction updated successfully!", "success").then(() =>
        navigate("/transactions")
      );
    } catch (error) {
      Swal.fire("Error", "Failed to update transaction.", "error");
    }
  };

  return (
    <div className="add-transaction-container">
      <h2>✏️ Edit Transaction</h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label>Note</label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          Update
        </button>
      </form>
    </div>
  );
}
