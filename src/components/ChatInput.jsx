import { useState } from 'react';

function ChatInput({ onSend }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Message:", message);
        // Here you would handle the message logic, like sending data to a server
        if (!message) {
            alert("Please enter a message");
            return;
        }

        onSend(message);

        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} style={{
            position: 'fixed',
            bottom: '10px', // Give some padding from the bottom
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            display: 'flex',
            backgroundColor: '#f8f9fa', // Light grey background
            padding: '10px 20px', // Padding around the form
            borderRadius: '25px', // Rounded borders
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Subtle shadow for depth
            alignItems: 'center',
            justifyContent: 'space-between' // Distributes space between children
        }}>
          
            <input
                type="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{
                    flex: 1, // Allows input to fill the form width
                    marginRight: '10px', // Space between input and button
                    padding: '10px', // Padding inside input
                    border: 'none', // Remove border
                    borderRadius: '15px', // Rounded corners for the input
                    fontSize: '16px', // Larger font size for readability
                    width: '100%' // Allows input to fill the parent div
                }}
            />
         
            <button type="submit" style={{
                backgroundColor: '#007bff', // Bootstrap primary color
                color: 'white', // Text color
                border: 'none',
                borderRadius: '15px',
                padding: '10px 20px', // Padding inside button
                fontSize: '16px', // Matching font size with input
                cursor: 'pointer', // Cursor indicates clickable
            }}>Send
            </button>
        </form>
    );
}

export default ChatInput;
