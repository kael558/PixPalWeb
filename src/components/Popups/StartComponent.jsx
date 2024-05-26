import { Overlay, Window } from "./OverlayComponent";

function StartComponent({ isVisible, userMood, onMessageSend, setRole }) {
    const setMood = (mood) => {
        console.log("User mood:", mood);
        onMessageSend(mood);
    };

    const setRoleHandler = (role) => {
        console.log("User role:", role);
        onMessageSend("I want you to be my " + role);
        setRole(role);
    };


    return (
        <Overlay isVisible={isVisible} style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
            <Window style={{
                backgroundColor: "#222", // Dark background for the window
                color: "white", // Base text color
                padding: "20px",
                borderRadius: "20px",
                border: "2px solid rgba(255, 163, 69, 0.8)", // Glowing border
                boxShadow: "0 0 20px rgba(255,163,69,0.7), 0 0 40px rgba(255,163,69,0.5) inset",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px", // Ensure there's enough vertical space
            }}>
                {!userMood ? (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "18px", marginBottom: "20px" }}>How are you feeling right now?</p>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)", // Four buttons per row
                            gap: "10px",
                            marginBottom: "10px",
                        }}>
                            {["Happy 😊", "Sad 😢", "Angry 😡", "Anxious 😨", "Excited 🎉", "Tired 😴", "Stressed 😖", "Confused 😕"].map(mood => (
                                <button key={mood} onClick={() => setMood(mood)} style={{
                                    padding: "10px",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(255, 163, 69, 0.8)",
                                    color: "black",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    textShadow: "0 0 2px rgba(0,0,0,0.5)",
                                }}>
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "18px", marginBottom: "20px" }}>What are you looking for?</p>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)", // Three buttons per row
                            gap: "10px",
                        }}>
                            {["Friend", "Advice", "Intimacy"].map(role => (
                                <button key={role} onClick={() => setRoleHandler(role === "Friend" ? "Friend" : (role === "Advice" ? "Teacher" : "Intimate Partner"))} style={{
                                    padding: "10px",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(255, 163, 69, 0.8)",
                                    color: "black",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    textShadow: "0 0 2px rgba(0,0,0,0.5)",
                                }}>
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </Window>
        </Overlay>
    );
}

export default StartComponent;
