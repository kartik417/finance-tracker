import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserAlt } from "react-icons/fa";
import "./Register.css";

function Register() {

   const navigate = useNavigate();

   const nameRef = useRef();

   const [loading, setLoading] = useState(false);

   const [showPassword, setShowPassword] = useState(false);

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: ""
   });

   useEffect(() => {
      nameRef.current.focus();
   }, []);

   const handleChange = (e) => {

      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });

   };

   const handleSubmit = async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

         const response = await API.post(
            "/auth/register",
            formData
         );

         alert(response.data.message);

         navigate("/");

      } catch (error) {

         console.log(error);

         alert("Registration failed");

      } finally {

         setLoading(false);

      }
   };

   return (

      <div className="register-container">

         <div className="bg-circle circle1"></div>
         <div className="bg-circle circle2"></div>

         <div className="register-card">

            <div className="logo-box">
               <FaUserAlt />
            </div>

            <h1>Create Account</h1>

            <p className="subtitle">
               Join Expense Tracker today
            </p>

            <form onSubmit={handleSubmit}>

               <div className="input-group">

                  <input
                     ref={nameRef}
                     type="text"
                     name="name"
                     placeholder="Enter Name"
                     onChange={handleChange}
                     required
                  />

               </div>

               <div className="input-group">

                  <input
                     type="email"
                     name="email"
                     placeholder="Enter Email"
                     onChange={handleChange}
                     required
                  />

               </div>

               <div className="input-group password-group">

                  <input
                     type={showPassword ? "text" : "password"}
                     name="password"
                     placeholder="Enter Password"
                     onChange={handleChange}
                     required
                  />

                  <span
                     className="eye-icon"
                     onClick={() =>
                        setShowPassword(!showPassword)
                     }
                  >
                     {
                        showPassword
                           ? <FaEyeSlash />
                           : <FaEye />
                     }
                  </span>

               </div>

               <button
                  type="submit"
                  className="register-main-btn"
               >

                  {
                     loading
                        ? "Registering..."
                        : "Register"
                  }

               </button>

            </form>

            <div className="divider">
               <span>OR</span>
            </div>

            <p className="login-text">
               Already have an account?
            </p>

            <button
               className="login-btn"
               onClick={() => navigate("/")}
            >
               Back to Login
            </button>

         </div>

      </div>
   );
}

export default Register;