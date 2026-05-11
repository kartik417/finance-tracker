import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

   const navigate = useNavigate();

   const nameRef = useRef();

   const [loading, setLoading] = useState(false);

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: ""
   });

   // page load pe focus
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

         <div className="register-card">

            <h1>Create Account</h1>

            <p className="subtitle">
               Register to continue
            </p>

            <form onSubmit={handleSubmit}>

               <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  onChange={handleChange}
                  required
               />

               <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  required
               />

               <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  required
               />

               <button type="submit">

                  {
                     loading
                        ? "Registering..."
                        : "Register"
                  }

               </button>

            </form>

            <p className="login-text">
               Already have an account?
            </p>

            <button
               className="login-btn"
               onClick={() => navigate("/")}
            >
               Login
            </button>

         </div>

      </div>
   );
}

export default Register;