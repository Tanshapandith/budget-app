import React from "react";
// import "./TransactionTable.css"; // Optional

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return ;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* <h3>Filtered Transactions</h3> */}
      {/* <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
          </tr> 
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.date}</td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}
