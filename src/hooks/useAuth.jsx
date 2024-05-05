
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const auth = getAuth();


    const get_access_token = async () => {
        // check if existing token is still valid
        return (await auth.currentUser.getIdTokenResult(true)).token;
    };

    const is_authenticated = () => {
        return auth.currentUser !== null;
    };


    // call this function when you want to authenticate the user
    const register = async (data) => {
        // add a UID to the user object
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User:', user);
                navigate("/login");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error:', errorCode, errorMessage);
                alert('Error creating user');
            });
    };


    const login = async (data) => {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

        if (!userCredential) {
            return false;
        }

        return true;
            /*.then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User:', user);

                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error:', errorCode, errorMessage);
                alert('Invalid email or password');
            });*/
    };

    // call this function to sign out logged in user
    const logout = () => {
        signOut(auth);
    };

    const value = useMemo(
        () => ({
            user: auth.currentUser,
            register,
            login,
            logout,
            get_access_token,
            is_authenticated
        }),
        [auth.currentUser, register, login, logout, get_access_token, is_authenticated]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};