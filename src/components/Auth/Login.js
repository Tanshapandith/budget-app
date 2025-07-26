// src/components/Auth/Login.js
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const showToast = (msg, icon = "success") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: msg,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        Swal.fire({
          icon: "error",
          title: "Account not verified",
          text: "Please verify your email before logging in.",
          confirmButtonText: "Resend Verification Email",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await sendEmailVerification(user);
            showToast("Verification email resent. Check your inbox.", "info");
          }
        });

        return;
      }

      localStorage.setItem("userId", user.uid);
      navigate("/dashboard");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showToast("Enter your email to reset password.", "warning");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent.", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={!email || !password}>
          Login
        </button>

        <div className="auth-actions">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="auth-link-btnn"
          >
            Forgot Password?
          </button>
        </div>

        <p>
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
