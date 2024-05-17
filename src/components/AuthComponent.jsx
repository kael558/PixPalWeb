import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence  } from "framer-motion";

function AuthenticationComponent({ isVisible, onClose }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and register view

	const { loginWithEmailAndPassword, registerWithEmailAndPassword } = useAuth();

	const handleLogin = async (event) => {
		event.preventDefault();
		console.log("Login Details:", { email, password });
        if (await loginWithEmailAndPassword({ email, password })){
            onClose();
        }
	};

	const handleRegister = async (event) => {
		event.preventDefault();

        if (await registerWithEmailAndPassword({ email, password })){
            onClose();
        }
	};

	return (
        <AnimatePresence>
            {isVisible && (
            <motion.div          
                style={{
                    display: "flex",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                }}
            >
                <motion.div
                 initial={{
                    y: 50, // Start 50 pixels below the final position
                    scale: 0
                }}
                animate={{
                    y: isVisible ? 0 : 50, // End at position 0, or move down to 50 pixels below
                    scale: isVisible ? 1 : 0
                }}
                exit={{
                    y: 50, // Move down to 50 pixels below when exiting
                    scale: 0
                }}
                transition={{
                    type: "spring", // Spring animation
                    stiffness: 300, // Stiffness of the spring
                    damping: 20, // Damping - higher numbers will slow it down more
                    duration: 0.8 // Duration of the transition in seconds
                }}

                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "10px 0px 20px 0px",
                        backgroundColor: "#FFF",
                        borderRadius: "12px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        width: "300px",
                        position: "relative", // This makes the child absolute positioning relative to this div
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        ✖
                    </button>
                    <h2>{isLoginView ? "Sign In" : "Register"}</h2>
                    <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                htmlFor="email"
                                style={{ display: "block", marginBottom: "5px" }}
                            >
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                autoComplete="username"
                                style={{
                                    boxSizing: "border-box",
                                    width: "100%",
                                    padding: "10px 10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                htmlFor="password"
                                style={{ display: "block", marginBottom: "5px" }}
                            >
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{
                                    boxSizing: "border-box",
                                    width: "100%",
                                    padding: "10px 10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#0066ff",
                                color: "white",
                                borderRadius: "5px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {isLoginView ? "Login" : "Register"}
                        </button>
                    </form>
                    <button
                        onClick={() => setIsLoginView(!isLoginView)}
                        style={{
                            marginTop: "20px",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#0066ff",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {isLoginView
                            ? "Need an account? Register"
                            : "Have an account? Sign In"}
                    </button>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
	);
}

export default AuthenticationComponent;
