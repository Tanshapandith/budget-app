// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import "./Style.css";


// export default function Transaction() {
//   const [transactions, setTransactions] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     date: "",
//     type: "",
//     category: "",
//     amount: "",
//     note: "",
//   });

//   const userId = localStorage.getItem("userId");

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}.json`
//       );
//       const data = await res.json();

//       if (data) {
//         const parsed = Object.entries(data).map(([id, item]) => ({
//           id,
//           ...item,
//         }));
//         setTransactions(parsed);
//       } else {
//         setTransactions([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch transactions:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       if (!formData.type || !userId) return;
//       try {
//         const res = await fetch(
//           `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}.json`
//         );
//         const data = await res.json();

//         if (data) {
//           const filtered = Object.entries(data)
//             .map(([id, cat]) => ({ id, ...cat }))
//             .filter((cat) => cat.type.toLowerCase() === formData.type);
//           setCategories(filtered);
//         } else {
//           setCategories([]);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, [formData.type, userId]);

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won’t be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",

//     });

//     if (result.isConfirmed) {
//       try {
//         await fetch(
//           `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}/${id}.json`,
//           { method: "DELETE" }
//         );
//         setTransactions((prev) => prev.filter((tx) => tx.id !== id));
//         Swal.fire("Deleted!", "Your transaction has been deleted.", "success");
//       } catch (err) {
//         Swal.fire("Error!", "Failed to delete transaction.", "error");
//       }
//     }
//   };

//   const handleEdit = (id) => {
//     const tx = transactions.find((t) => t.id === id);
//     if (tx) {
//       setFormData({
//         date: tx.date,
//         type: tx.type,
//         category: tx.category,
//         amount: tx.amount,
//         note: tx.note || "",
//       });
//       setEditId(id);
//       setIsEditMode(true);
//       setShowModal(true);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newTransaction = {
//       ...formData,
//       createdAt: new Date().toISOString(),
//     };

//     const url = isEditMode
//       ? `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}/${editId}.json`
//       : `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}.json`;

//     const method = isEditMode ? "PUT" : "POST";

//     try {
//       await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newTransaction),
//       });

//       Swal.fire({
//         icon: "success",
//         title: isEditMode ? "Transaction updated!" : "Transaction added!",
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 2000,
//       });

//       setShowModal(false);
//       setFormData({
//         date: "",
//         type: "",
//         category: "",
//         amount: "",
//         note: "",
//       });
//       setIsEditMode(false);
//       setEditId(null);
//       fetchData();
//     } catch (error) {
//       Swal.fire("Error", "Something went wrong!", "error");
//     }
//   };

//   return (
//     <div className="transaction-page">
//       <div className="transaction-header">
//         <h2>💸 Transactions</h2>
//         <button
//           className="add-btn"
//           onClick={() => {
//             setShowModal(true);
//             setIsEditMode(false);
//             setFormData({
//               date: "",
//               type: "",
//               category: "",
//               amount: "",
//               note: "",
//             });
//           }}
//         >
//           + Add Transaction
//         </button>
//       </div>

//       <div className="transaction-table-wrapper">

//         <table className="transaction-table">
//           <thead>
//             <tr>
//               <th>Type</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Date</th>
//               <th>Amount</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6">
//                   <div className="loader">
//                     <span className="loader-spinner"></span>
//                   </div>
//                 </td>
//               </tr>
//             ) : transactions.length === 0 ? (
//               <tr>
//                 <td colSpan="6" style={{ textAlign: "center" }}>
//                   No transactions found.
//                 </td>
//               </tr>
//             ) : (
//               transactions.map((tx) => (
//                 <tr key={tx.id}>
//                   <td>{tx.type}</td>
//                   <td>
//                     <span
//                       className={`badge ${tx.type === "income" ? "badge-green" : "badge-red"
//                         }`}
//                     >
//                       {tx.category || "-"}
//                     </span>
//                   </td>
//                   <td>{tx.note || "-"}</td>
//                   <td>{tx.date}</td>
//                   <td>₹ {tx.amount}</td>
//                   <td>
//                     <button className="edit-btn" onClick={() => handleEdit(tx.id)}>
//                       Edit
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(tx.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
          
//         <p className="scroll-note">← Scroll to view →</p>
//       </div>

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal-content animate-modal">
//             <span className="close-btn" onClick={() => setShowModal(false)}>
//               &times;
//             </span>
//             <h2>{isEditMode ? "✏️ Edit Transaction" : "➕ Add New Transaction"}</h2>
//             <form className="transaction-form" onSubmit={handleSubmit}>
//               <label htmlFor="date">Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />

//               <label htmlFor="type">Type</label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select</option>
//                 <option value="income">Income</option>
//                 <option value="expense">Expense</option>
//               </select>

//               <label htmlFor="category">Category</label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.title}>
//                     {cat.title}
//                   </option>
//                 ))}
//               </select>

//               <label htmlFor="amount">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 required
//               />

//               <label htmlFor="note">Note</label>
//               <input
//                 type="text"
//                 name="note"
//                 value={formData.note}
//                 onChange={handleChange}
//               />

//               <button type="submit" className="submit-btn">
//                 {isEditMode ? "Update" : "Submit"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Style.css";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    category: "",
    amount: "",
    note: "",
  });

  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!formData.type || !userId) return;
      try {
        const res = await fetch(
          `https://expenses-application-92499-default-rtdb.firebaseio.com/AddCategory/${userId}.json`
        );
        const data = await res.json();

        if (data) {
          const filtered = Object.entries(data)
            .map(([id, cat]) => ({ id, ...cat }))
            .filter((cat) => cat.type.toLowerCase() === formData.type);
          setCategories(filtered);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [formData.type, userId]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await fetch(
          `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}/${id}.json`,
          { method: "DELETE" }
        );
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        Swal.fire("Deleted!", "Your transaction has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete transaction.", "error");
      }
    }
  };

  const handleEdit = (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      setFormData({
        date: tx.date,
        type: tx.type,
        category: tx.category,
        amount: tx.amount,
        note: tx.note || "",
      });
      setEditId(id);
      setIsEditMode(true);
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const url = isEditMode
      ? `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}/${editId}.json`
      : `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${userId}.json`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Transaction updated!" : "Transaction added!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });

      setShowModal(false);
      setFormData({
        date: "",
        type: "",
        category: "",
        amount: "",
        note: "",
      });
      setIsEditMode(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <h2>💸 Transactions</h2>
        <button
          className="add-btn"
          onClick={() => {
            setShowModal(true);
            setIsEditMode(false);
            setFormData({
              date: "",
              type: "",
              category: "",
              amount: "",
              note: "",
            });
          }}
        >
          + Add Transaction
        </button>
      </div>

      <div className="transaction-table-wrapper">
        <div className="transaction-table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="loader">
                      <span className="loader-spinner"></span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.type}</td>
                    <td>
                      <span
                        className={`badge ${
                          tx.type === "income" ? "badge-green" : "badge-red"
                        }`}
                      >
                        {tx.category || "-"}
                      </span>
                    </td>
                    <td>{tx.note || "-"}</td>
                    <td>{tx.date}</td>
                    <td>₹ {tx.amount}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(tx.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(tx.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="scroll-note">← Scroll to view →</p>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content animate-modal">
            <span className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>{isEditMode ? "✏️ Edit Transaction" : "➕ Add New Transaction"}</h2>
            <form className="transaction-form" onSubmit={handleSubmit}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <label htmlFor="type">Type</label>
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

              <label htmlFor="category">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
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
                {isEditMode ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
