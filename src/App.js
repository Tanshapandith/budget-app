// import React from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import Dashboard from "./Pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";

// import Categories from "./Pages/Categories";
// import Transaction from "./Pages/Transaction";
// import EditTransaction from "./Pages/EditTransaction";
// import AddTransaction from "./Pages/AddTransaction";
// import AddCategory from "./Pages/AddCategory";

// import "./App.css";


// function Layout({ children }) {
//   const location = useLocation();
//   const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

//   return (
//     <div className="app-container">
//       {!hideNavbar && <Navbar />}
//       <main className="main-content">{children}</main>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/categories"
//             element={
//               <ProtectedRoute>
//                 <Categories />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/transactions"
//             element={
//               <ProtectedRoute>
//                 <Transaction />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/add-transaction"
//             element={
//               <ProtectedRoute>
//                 <AddTransaction />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/edit-transaction/:id"
//             element={
//               <ProtectedRoute>
//                 <EditTransaction />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/add-category"
//             element={
//               <ProtectedRoute>
//                 <AddCategory />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Categories from "./Pages/Categories";
import EditCategory from "./Pages/EditCategoryModal";
import Transaction from "./Pages/Transaction";
import EditTransaction from "./Pages/EditTransaction";


import "./App.css";

function Layout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <Transaction />
              </Layout>
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/edit-transaction/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditTransaction />
              </Layout>
            </ProtectedRoute>
          }
        />
       
        <Route path="/edit-category/:id" element={<EditCategory />} />

      </Routes>
    </Router>
  );
}

export default App;
