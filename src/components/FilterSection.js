import React, { useState, useEffect } from "react";
import "./Filter.css";

export default function FilterSection() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });

  useEffect(() => {
    const UserId = localStorage.getItem("userId");
    const fetchData = async () => {
      const res = await fetch(
        `https://expenses-application-92499-default-rtdb.firebaseio.com/transactions/${UserId}.json`
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
      setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const normalizeDate = (str) => new Date(str).toISOString().split("T")[0];

  useEffect(() => {
    let result = transactions;

    if (startDate) {
      result = result.filter((tx) => normalizeDate(tx.date) >= startDate);
    }

    if (endDate) {
      result = result.filter((tx) => normalizeDate(tx.date) <= endDate);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.type?.toLowerCase().includes(keyword) ||
          tx.note?.toLowerCase().includes(keyword) ||
          tx.date?.toLowerCase().includes(keyword) ||
          String(tx.amount).includes(keyword)
      );
    }

    setFiltered(result);

    const income = result
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const expense = result
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const net = income - expense;

    setTotals({ income, expense, net });
  }, [search, startDate, endDate, transactions]);

  return (
    <div className="filter-wrapper">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card income-card">
          💸 <h4>Total Income</h4>
          <p>₹ {totals.income}</p>
        </div>
        <div className="card expense-card">
          📉 <h4>Total Expense</h4>
          <p>₹ {totals.expense}</p>
        </div>
        <div className="card net-card">
          📈 <h4>Total Amount</h4>
          <p>₹ {totals.net}</p>
        </div>
      </div>

      {/* Filter Form */}
      <form className="filter-section" onSubmit={(e) => e.preventDefault()}>
        <div className="filter-row">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
         <h1 className="or-heading">OR</h1>
        <div className="filter-group search-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by type, note, date or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      {/* Transaction Table */}
      <div className="filter-results">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Loading transactions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No matching transactions.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.type}</td>
                  <td>{tx.note || "-"}</td>
                  <td>{tx.date}</td>
                  <td>₹ {tx.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
