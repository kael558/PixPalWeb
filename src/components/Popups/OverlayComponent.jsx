import { motion, AnimatePresence } from "framer-motion";
import './Window.module.css'; // Assuming your CSS file is named Window.css


export function Overlay({ isVisible, children, style: customStyle }) {
        // Default styles
        const defaultStyle = {
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)", // Soft background blur effect for depth,
            overflow: "hidden", // Hide overflowing content
        }


        // Merging default styles with user-provided styles. User styles will override defaults if there are conflicts.
        const combinedStyles = { ...defaultStyle, ...customStyle };

        
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={combinedStyles}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}



export function Window({ ref, children, style: customStyle }) {
    // Default styles
    const defaultStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 0 20px rgba(255,163,69,0.7), 0 0 40px rgba(255,163,69,0.5) inset",
        position: "relative",
        minWidth: "300px",
        maxWidth: "90vw",
        color: "white",
        border: "2px solid rgba(255, 163, 69, 0.8)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease-in-out",

    };


    // Merging default styles with user-provided styles. User styles will override defaults if there are conflicts.
    const combinedStyles = { ...defaultStyle, ...customStyle };

    return (
        <div style={combinedStyles} ref={ref}>
            {children}
        </div>
    );
}
