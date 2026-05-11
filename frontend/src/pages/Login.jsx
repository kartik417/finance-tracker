import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import "./Login.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const emailRef = useRef();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // page load pe email input focus
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

            alert(response.data.message);

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Login failed");

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Welcome Back</h1>
                <p className="subtitle">
                    Login to continue
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        ref={emailRef}
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
                                ? "Logging in..."
                                : "Login"
                        }

                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?
                </p>

                <button
                    className="register-btn"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>

            </div>

        </div>
    );
}

export default Login;