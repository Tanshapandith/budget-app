import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Addtransaction.css";

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    date: "",
    // category: "",
      type: "",
    amount: "",
    note: "",
  });
   
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
const userId = localStorage.getItem("userId"); 

    const newTransaction = {
      ...formData,
      createdAt: new Date().toISOString(),
    };
    

    try {
      await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Transaction added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/transactions"); 
      });
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="add-transaction-container">
      <h2>➕ Add New Transaction</h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label htmlFor="note">Note</label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
