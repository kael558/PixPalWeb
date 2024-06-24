
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

    auth.onAuthStateChanged((user) => {
        if (user) {
            window.gtag('event', 'login', {
                method: user.isAnonymous ? 'anonymous' : 'email',
            });

            // set user id
            window.gtag('set', { user_id: user.uid });
        } 
    });


    const getAccessToken = async () => {
        await auth.authStateReady();

        if (!auth.currentUser) {
            return false;
        }

        return (await auth.currentUser.getIdTokenResult(false)).token;
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

            window.gtag('event', 'sign_up', {
                method: 'email',
            });

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
                toast.error('Account already exists with this email');
                return false;
            }

            window.gtag('event', 'sign_up', {
                method: 'email',
            });

            await loginWithEmailAndPassword(data);

            toast.success('Successfully registered user');
            return true;
        } catch (error) {
            toast.error('Account already exists with this email');
            return false;
        }
    };


    const loginWithEmailAndPassword = async (data) => {
        if (auth.currentUser && auth.currentUser.isAnonymous) {
            // sign out the anonymous user
            await signOut(auth);
        }

        if (auth.currentUser && !auth.currentUser.isAnonymous){
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
            console.log(auth.currentUser);
            return true;
        } catch (error) {
            toast.error('Failed to log in user');
            return false;
        }
    };

    // call this function to sign out logged in user
    const logout = async () => {
        if (!auth.currentUser) {
            toast.error('No user logged in');
            return;
        }
    
        try {
            await signOut(auth);
            toast.success('You have been logged out.');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Failed to log out.');
        }
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
        isAnonymous, 
        auth
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};