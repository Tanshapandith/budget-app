import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-transaction");
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirm) return;

    try {
      await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${id}.json`,
        {
          method: "DELETE",
        }
      );
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId"); 
    
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}.json`
        );
        const data = await res.json();

        if (data) {
          const parsed = Object.entries(data).map(([id, item]) => ({
            id,
            ...item,
          }));  
          setTransactions(parsed);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <h2>💸 Transactions</h2>
        <button className="add-btn" onClick={handleAddClick}>
          + Add Transaction
        </button>
      </div>

      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.type}</td>
                  <td>{tx.note || "-"}</td>
                  <td>{tx.date}</td>
                  <td>₹ {tx.amount}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(tx.id)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(tx.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


