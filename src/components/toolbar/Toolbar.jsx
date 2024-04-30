import React from 'react';
import Tokens from './Tokens';

import { useAuth } from '../../hooks/useAuth';


function Toolbar(){

    const auth = useAuth();


    return(
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '30px', display: 'flex',  
        justifyContent: 'flex-end', 
        alignItems: 'center' }}>
            <Tokens/>
            <button onClick={auth.logout} style={{ marginLeft: '10px' }}>Logout</button>

        </div>
    )
}

export default Toolbar;