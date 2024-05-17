import { motion, AnimatePresence } from "framer-motion";

function StartComponent({ isVisible, userMood, setUserMood, setRole }) {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					style={{
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
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "10px",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                            position: "relative",
						}}
					>
                        {!userMood ? (
                            <div>
                        <p>
                            How are you feeling right now?
                        </p>
                        <span>
                        <button onClick={() => setUserMood("Happy")}>
                            Happy 😊
                        </button>
                        <button onClick={() => setUserMood("Sad")}>
                            Sad 😢
                        </button>
                        <button onClick={() => setUserMood("Angry")}>
                            Angry 😡
                        </button>
                        <button onClick={() => setUserMood("Anxious")}>
                            Anxious 😨
                        </button>
                        <button onClick={() => setUserMood("Excited")}>
                            Excited 🎉
                        </button>
                        <button onClick={() => setUserMood("Tired")}>
                            Tired 😴
                        </button>
                        <button onClick={() => setUserMood("Stressed")}>
                            Stressed 😖
                        </button>
                        <button onClick={() => setUserMood("Confused")}>
                            Confused 😕
                        </button>

                        </span>
                        </div>
                        ) : (
                            <div>
                        <p>
                           What are you looking for?
                        </p>
                        <span>
                            <button onClick={() => setRole("Friend")}>
                                A friend
                            </button>
                            <button onClick={() => setRole("Teacher")}>
                                Advice
                            </button>
                            <button onClick={() => setRole("Intimate Partner")}>
                                Intimacy
                            </button>
                        </span>
                </div>



                        )}
           
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default StartComponent;
