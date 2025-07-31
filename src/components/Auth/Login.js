// import React, { useState } from "react";
// import {
//   signInWithEmailAndPassword,
//   sendEmailVerification,
//   sendPasswordResetEmail,
// } from "firebase/auth";
// import { auth } from "../../firebase";
// import { useNavigate, Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import "./Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const showToast = (msg, icon = "success") => {
//     Swal.fire({
//       toast: true,
//       position: "top-end",
//       icon,
//       title: msg,
//       showConfirmButton: false,
//       timer: 3000,
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       if (!user.emailVerified) {
//         Swal.fire({
//           icon: "error",
//           title: "Account not verified",
//           text: "Please verify your email before logging in.",
//           confirmButtonText: "Resend Verification Email",
//         }).then(async (result) => {
//           if (result.isConfirmed) {
//             await sendEmailVerification(user);
//             showToast("Verification email resent. Check your inbox.", "info");
//           }
//         });

//         return;
//       }

//       localStorage.setItem("userId", user.uid);
//       navigate("/dashboard");
//     } catch (error) {
//       showToast(error.message, "error");
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       showToast("Enter your email to reset password.", "warning");
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       showToast("Password reset email sent.", "success");
//     } catch (error) {
//       showToast(error.message, "error");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleLogin}>
//         <h2>Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           autoFocus
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit" disabled={!email || !password}>
//           Login
//         </button>

//         <div className="auth-actions">
//           <button
//             type="button"
//             onClick={handleForgotPassword}
//             className="auth-link-btnn"
//           >
//             Forgot Password?
//           </button>
//         </div>

//         <p>
//           Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
//         </p>
//       </form>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const showToast = (msg, type = "success") => {
    toast[type](msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Email and Password are required!", "warning");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("userId", user.uid);
      showToast("Login successful!", "success");
      setTimeout(() => navigate("/dashboard"), 1000);
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
      <ToastContainer />
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div> */}

        <button type="submit">Login</button>

        <div className="auth-actions">
          <button type="button" onClick={handleForgotPassword} className="auth-link-btnn">
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
