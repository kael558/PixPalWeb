import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const auth = useAuth();

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Registration Details:", { email, password });
		// Here you would handle the registration logic, like sending data to a server
		if (!email || !password) {
			alert("Please enter both email and password");
			return;
		}

		auth.register({ email, password });
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type="submit">Register</button>
		</form>
	);
}

export default Register;
