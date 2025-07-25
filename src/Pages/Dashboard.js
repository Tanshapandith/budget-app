import React, { useState, useEffect } from "react";
import FilterSection from "../components/FilterSection";
import TransactionTable from "../components/TransactionTable";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
    
        "https://expenses-application-92499-default-rtdb.firebaseio.com/transactions.json"
      );
      const data = await res.json();

      const loadedTransactions = Object.values(data || {}).map((item) => ({
        ...item,
        date: item.date || new Date().toISOString(),
      }));

      setTransactions(loadedTransactions);
      setFiltered(loadedTransactions);
    };

    fetchData();
  }, []);

  const handleFilter = ({ search, startDate, endDate }) => {
    let filteredData = [...transactions];

    if (search) {
      filteredData = filteredData.filter((t) =>
        (t.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate) {
      filteredData = filteredData.filter(
        (t) => new Date(t.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredData = filteredData.filter(
        (t) => new Date(t.date) <= new Date(endDate)
      );
    }

    setFiltered(filteredData);
  };

  return (
    <>
      <FilterSection onFilterChange={handleFilter} />
      <TransactionTable transactions={filtered} />
      {}
    </>
  );
}
