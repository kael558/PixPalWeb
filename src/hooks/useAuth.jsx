
import { createContext, useContext } from "react";
import { toast } from 'react-toastify';

import {
    getAuth,
    signInAnonymously,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    linkWithCredential,
    EmailAuthProvider,
    sendPasswordResetEmail
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

    const forgotPassword = async (data) => {
        try {
            await sendPasswordResetEmail(auth, data.email);
            toast.success('Password reset email sent');
            return true;
        } catch (error) {
            toast.error('Failed to send password reset email');
            return false;
        }
    }


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
        if (!data.email || !data.password) {
            toast.error('Invalid email or password');
            return false;
        }

        // if the user is anonymous, link the anonymous account to the email
        if (auth.currentUser.isAnonymous) {
            return await linkAnonymousToEmail(data);
        }

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

    const linkAnonymousToEmail = async (data) => {
        try {
            const credential = EmailAuthProvider.credential(data.email, data.password);
            const userCredential = await linkWithCredential(auth.currentUser, credential);

            if (!userCredential) {
                toast.error('Failed to link anonymous user');
                return false;
            }

            toast.success('Successfully linked anonymous user');
            return true;
        } catch (error) {
            toast.error('Failed to link anonymous user');
            return false;
        }
    };


    const loginWithEmailAndPassword = async (data) => {
        if (auth.currentUser && auth.currentUser.isAnonymous) {
            toast.error('You must first register an account to link your anonymous account');
            return false;
        }

        if (auth.currentUser){
            toast.error('You are already logged in');
            return false;
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

        toast.success('You have been logged out.');
        signOut(auth);
    };

    const isAnonymous = () => {
        return auth?.currentUser?.isAnonymous;
    };

    const value = {
        loginAnonymously,
        forgotPassword,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        logout,
        getAccessToken,
        isAuthenticated,
        isAnonymous
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};