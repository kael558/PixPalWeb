import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

import { Overlay, Window} from "./OverlayComponent";
import { toast } from "react-toastify";
import { useHue } from "@hooks/useHue";
import { TailSpin } from "react-loader-spinner";

function AuthenticationComponent({ isVisible, onClose }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and register view

	const { loginWithEmailAndPassword, registerWithEmailAndPassword, forgotPassword } = useAuth();
    const [loading, setLoading] = useState(false);

    const { hue, getRGBStr } = useHue();
	const rgbStr = getRGBStr();

	const handleLogin = async (event) => {
		event.preventDefault();
        setLoading(true);
		//console.log("Login Details:", { email, password });
		if (await loginWithEmailAndPassword({ email, password })) {
            setEmail("");
            setPassword("");
            onClose();
		}
        setLoading(false);
	};

	const handleRegister = async (event) => {
		event.preventDefault();
        setLoading(true);

		if (await registerWithEmailAndPassword({ email, password })) {
            setEmail("");
            setPassword("");
			onClose();
		}
        setLoading(false);
	};

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);

        if (await forgotPassword({ email })) {
            onClose();
        }
        setLoading(false);
    }

	return (
        <Overlay isVisible={isVisible} style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
            {loading&& (
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "12px",
							zIndex: 2, // Make sure this is on top of other content
						}}
					>
						<TailSpin
							height="80"
							width="80"
							color="white"
							ariaLabel="loading"
						/>
					</div>
				)}


            <Window>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "24px",
                        color: "white", // Changed to white for visibility
                        filter: `drop-shadow(0 0 5px rgba(${rgbStr},0.8)) ${loading ? "blur(5px)" : ""}`, // Adding a subtle glow effect
                    }}
                >
                    ✖
                </button>
                <h2 style={{ color: "white", textShadow: `0 0 10px rgba(${rgbStr},0.8)` }}>{isLoginView ? "Sign In" : "Register"}</h2>
                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="email"
                            style={{ display: "block", marginBottom: "5px", color: "white" }}
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
                                border: `1px solid rgba(${rgbStr}, 0.5)`, // Border color modified
                                backgroundColor: "#222", // Darker input fields
                                color: "white", // Text color changed for contrast
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="password"
                            style={{ display: "block", marginBottom: "5px", color: "white" }}
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
                                border: `1px solid rgba(${rgbStr}, 0.5)`, // Consistent border styling
                                backgroundColor: "#222",
                                color: "white",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: `rgba(${rgbStr}, 0.8)`, // Button color changed to fit theme
                            color: "black",
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
                        color: `rgba(${rgbStr}, 0.8)`, // Color matching the theme
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    {isLoginView ? "Need an account? Register" : "Have an account? Sign In"}
                </button>
                {isLoginView && (
                       <button
                       onClick={handleForgotPassword}
                       style={{
                           marginTop: "20px",
                           backgroundColor: "transparent",
                           border: "none",
                           color: `rgba(${rgbStr}, 0.8)`, // Color matching the theme
                           textDecoration: "underline",
                           cursor: "pointer",
                       }}
                   >
                          Forgot Password?  
                   </button>
                )}
            </Window>
        </Overlay>
    );
    
}

export default AuthenticationComponent;
