import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";

async function get_tokens(accessToken){
    console.log('Bearer ' + accessToken);
    return fetch("https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/tokens", {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            return response.json();  // Return the promise to be handled by the next .then()
        } else {
            throw new Error('Failed to fetch tokens');
        }
    }).then(data => {
        console.log('Data:', data);
        return data;  // Return data for subsequent handling
    }).catch(error => {
        console.error('Error:', error);
        return { tokens: 0 };  // Return default object in case of error
    });
}

async function initiate_purchase(accessToken){
    return fetch("https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/session", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            return response.json();  // Return the promise to be handled by the next .then()
        } else {
            throw new Error('Failed to initiate purchase');
        }
    }).then(data => {
        console.log('Data:', data);
        return data;  // Return data for subsequent handling
    }).catch(error => {
        console.error('Error:', error);
        return { url: 0 };  // Return default object in case of error
    });
}

function Tokens(){
    const [tokens, setTokens] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (!auth.is_authenticated()){
            navigate("/login");
            return;
        }

        setLoading(true);
        auth.get_access_token().then(token => {
            get_tokens(token).then(data => {
                setTokens(data.tokens || 0); // Fallback to 0 if data.tokens is undefined
                setLoading(false);
            });
        }).catch(error => {
            console.error('Error getting ID token:', error);
            setLoading(false);
        });
        
    }, [auth.user]);  // Include auth.user in dependency array to react to changes

    return(
        <div style={{ color: 'white' }}>
            {loading ? <p>Loading...</p> : <p>Tokens: {tokens}</p>}
        </div>
    )
}

export default Tokens;
