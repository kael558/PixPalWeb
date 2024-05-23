import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

import { toast } from "react-toastify";
import { Overlay, Window } from "./OverlayComponent";

function TokensComponent({ isVisible, onClose }) {
    const [purchaseInProgress, setPurchaseInProgress] = useState(false);
    const { getAccessToken } = useAuth();

    const get_free_tokens = async (accessToken) => {
        const response = await fetch(
            "https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/register",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            }
        );

        if (!response.ok) {
            console.error(response);
            setPurchaseInProgress(false);
            toast.error("Failed to get free tokens");
            return;
        }

        setPurchaseInProgress(false);
        toast.success("Free tokens added to your account");
    };

    const initiate_purchase = async (id) => {
        if (purchaseInProgress) {
            toast.error("Purchase already in progress");
            return;
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            toast.error("Please log in to purchase");
            return;
        }

        setPurchaseInProgress(true);
        if (id === 0) {
            get_free_tokens(accessToken);
            return;
        }

        const response = await fetch(
            "https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/session",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
                body: JSON.stringify({ itemId: id }),
            }
        );

        if (!response.ok) {
            console.error(response);
            toast.error("Failed to initiate purchase");
            setPurchaseInProgress(false);
            return;
        }

        const { sessionId, url } = await response.json();
        window.open(url, "_blank");

        while (true) {
            const status_response = await fetch(
                `https://0xlgvmu6h4.execute-api.us-east-1.amazonaws.com/session?sessionId=${sessionId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );

            if (!status_response.ok) {
                console.error(response);
                toast.error("Failed to check purchase status");
                break;
            }

            const { status } = await status_response.json();

            if (status === "complete") {
                toast.success("Purchase complete");
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        setPurchaseInProgress(false);
    };

    const options = [
        { id: 0, title: "Bundle", price: "Free", image: "/diamonds/big_bundle_diamonds.png" },
        { id: 1, title: "Basic", price: "US $1.99", image: "/diamonds/bag_diamonds.png" },
        { id: 2, title: "Standard", price: "US $9.45", image: "/diamonds/barrel_diamonds.png" },
        { id: 3, title: "Premium", price: "US $17.99", image: "/diamonds/chest_diamonds.png" },
    ];

    return (
        <Overlay isVisible={isVisible}>
            <Window
                style={{
                    display: "flex",
                    flexDirection: "row",
					flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    padding: "20px",
                    borderRadius: "12px",
                    position: "relative",
                    maxHeight: "90vh",
                }}
            >
                {options.map((option) => (
                    <div
                        key={option.id}
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            backgroundColor: "#1A1A2E",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                        }}
                        onClick={() => initiate_purchase(option.id)}
                    >
                        <img
                            src={option.image}
                            alt={option.title}
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)",
                            }}
                        />
                        <h3
                            style={{
                                fontSize: "18px",
                                color: "#E0E0E0",
                                margin: "10px 0 5px 0",
                            }}
                        >
                            {option.title}
                        </h3>
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#0F52BA",
                                color: "white",
                                borderRadius: "20px",
                                border: "none",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                fontSize: "16px",
                                fontWeight: "bold",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#073B4C")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0F52BA")}
                        >
                            {option.price}
                        </button>
                    </div>
                ))}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "24px",
                        color: "gray", // Changed to white for visibility
                        filter: "drop-shadow(0 0 2px rgba(255,163,69,0.4))", // Adding a subtle glow effect
                    }}
                >
                    ✖
                </button>
            </Window>
        </Overlay>
    );
}

export default TokensComponent;
