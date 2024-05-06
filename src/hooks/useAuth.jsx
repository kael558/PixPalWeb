
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from 'react-toastify';

import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    linkWithCredential,
    EmailAuthProvider 
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const auth = getAuth();

    const showErrorToast = (msg) => {
        toast.error(msg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
    }

    const showSuccessToast = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
    }

    const getAccessToken = async () => {
        if (!auth.currentUser) {
            showErrorToast('No user logged in');
            return false;
        }

        return (await auth.currentUser.getIdTokenResult(true)).token;
    };

    const isAuthenticated = () => {
        if (!auth.currentUser) {
            showErrorToast('No user logged in');
            return false;
        }

        return auth.currentUser !== null;
    };

    const loginAnonymously = async () => {
        try {
            const user = await signInAnonymously(auth);
            if (!user) {
                showErrorToast('Failed to log in anonymously');
                return false;
            }
    
            showSuccessToast('Logged in anonymously');
            return true;
        } catch (error) {
            showErrorToast('Failed to log in anonymously');
            return false;
        }
    };


    // call this function when you want to authenticate the user
    const registerWithEmailAndPassword = async (data) => {
        try {
            const user = await createUserWithEmailAndPassword(auth, data.email, data.password);
            if (!user) {
                showErrorToast('Failed to register user');
                return false;
            }

            showSuccessToast('Registered user');
            return true;
        } catch (error) {
            showErrorToast('Failed to register user');
            return false;
        }
    };


    const loginWithEmailAndPassword = async (data) => {
        // if user is anonymous, then connect the anonymous user to the email/password account
        if (auth.currentUser?.isAnonymous) {
            try {
                const credential = EmailAuthProvider.credential(data.email, data.password);
                const userCredential = await linkWithCredential(auth.currentUser, credential);
    
                if (!userCredential) {
                    showErrorToast('Failed to link anonymous user');
                    return false;
                }
    
                showSuccessToast('Linked anonymous user');
                return true;
            } catch (error) {
                showErrorToast('Failed to link anonymous user');
                return false;
            }
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            if (!userCredential) {
                showErrorToast('Failed to log in user');
                return false;
            }

            showSuccessToast('Logged in user');
            return true;
        } catch (error) {
            showErrorToast('Failed to log in user');
            return false;
        }
    };

    // call this function to sign out logged in user
    const logout = () => {
        if (!auth.currentUser) {
            showErrorToast('No user logged in');
            return;
        }

        if (auth.currentUser.isAnonymous) {
            showErrorToast('Cannot log out anonymous user');
            return;
        }

        showSuccessToast('You have been logged out.');
        signOut(auth);
    };

    const isAnonymous = () => {
        return auth?.currentUser?.isAnonymous;
    };

    const value = useMemo(
        () => ({
            loginAnonymously,
            registerWithEmailAndPassword,
            loginWithEmailAndPassword,
            logout,
            getAccessToken,
            isAuthenticated,
            isAnonymous
        }),
        [auth.currentUser]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};