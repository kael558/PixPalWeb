import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, login } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (user) {
            console.log(user);
            //setLoading(true);
            //login({ 'email': user.email, 'password': user.password });
        }
    }, []);

    if (loading) {
        return (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '24px' }}>
                        <h1>Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Login Details:', { email, password });
      // Here you would typically handle the login logic, like calling an API
      login({ email, password });
    };
  
    return (<>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Register</button>
    </>
      
    );
  }
  
  export default LoginPage;


