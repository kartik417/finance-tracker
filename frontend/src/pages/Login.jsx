import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const emailRef = useRef();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        emailRef.current.focus();
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

        setMessage("");
        setErrorMsg("");

        try {

            const response = await API.post(
                "/auth/login",
                formData
            );

            const payload = JSON.parse(
                atob(response.data.token.split(".")[1])
            );

            login(
                response.data.token,
                payload.role
            );

            setMessage("Login Successful");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);

        } catch (error) {

            setErrorMsg(
                error.response?.data?.message ||
                "Login failed"
            );

            setLoading(false);
        }

        finally {

            setLoading(false);
        }
    };

    return (

        <div className="login-container">

            <div className="bg-circle circle1"></div>
            <div className="bg-circle circle2"></div>

            <div className="login-card">

                <div className="logo-box">
                    💰
                </div>

                <h1>Expense Tracker</h1>

                <p className="subtitle">
                    Manage your finances smarter
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <input
                            ref={emailRef}
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
                        className="login-btn"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Please wait..."
                                : "Login"
                        }

                    </button>

                </form>
                {
                    message && (
                        <p className="success-msg">
                            {message}
                        </p>
                    )
                }

                {
                    errorMsg && (
                        <p className="error-msg">
                            {errorMsg}
                        </p>
                    )
                }
                <div className="divider">
                    <span>OR</span>
                </div>

                <p className="register-text">
                    Don’t have an account?
                </p>

                <button
                    className="register-btn"
                    onClick={() => navigate("/register")}
                >
                    Create Account
                </button>

            </div>

        </div>
    );
}

export default Login;