
import { createContext, useContext, useMemo } from "react";
import { toast } from 'react-toastify';

import {
    getAuth,
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

    const getAccessToken = async () => {
        if (!auth.currentUser) {
            return false;
        }

        return (await auth.currentUser.getIdTokenResult(true)).token;
    };

    const isAuthenticated = () => {
        if (!auth.currentUser) {
            return false;
        }

        return auth.currentUser !== null;
    };

    const loginAnonymously = async () => {
        try {
            const user = await signInAnonymously(auth);
            if (!user) {
                toast.error('Failed to log in anonymously');
                return false;
            }
    
            toast.success('Logged in anonymously');
            return true;
        } catch (error) {
            toast.error('Failed to log in anonymously');
            return false;
        }
    };


    // call this function when you want to authenticate the user
    const registerWithEmailAndPassword = async (data) => {
        try {
            const user = await createUserWithEmailAndPassword(auth, data.email, data.password);
            if (!user) {
                toast.error('Failed to register user');
                return false;
            }

            toast.success('Registered user');
            return true;
        } catch (error) {
            toast.error('Failed to register user');
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
                    toast.error('Failed to link anonymous user');
                    return false;
                }
    
                toast.success('Linked anonymous user');
                return true;
            } catch (error) {
                toast.error('Failed to link anonymous user');
                return false;
            }
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            if (!userCredential) {
                toast.error('Failed to log in user');
                return false;
            }

            toast.success('Logged in user');
            return true;
        } catch (error) {
            toast.error('Failed to log in user');
            return false;
        }
    };

    // call this function to sign out logged in user
    const logout = () => {
        if (!auth.currentUser) {
            toast.error('No user logged in');
            return;
        }

        if (auth.currentUser.isAnonymous) {
            toast.error('Cannot log out anonymous user');
            return;
        }

        toast.success('You have been logged out.');
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
        [auth.currentUser, loginAnonymously, registerWithEmailAndPassword, loginWithEmailAndPassword, logout, getAccessToken, isAuthenticated, isAnonymous]
    );
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};