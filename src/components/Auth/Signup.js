import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Sign out the user until they verify
      await signOut(auth);

      // Success alert with redirect after confirmation
      Swal.fire({
        icon: "success",
        title: "Verification Email Sent",
        text: "Please check your inbox and verify your email before logging in.",
        confirmButtonColor: "#4e54c8",
      }).then(() => {
        navigate("/"); // redirect to login
      });
    } catch (error) {
      // Error alert
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
