
import { useState } from "react";
import Micro from "./Micro";


export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you?" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { from: "user", text: message }]);
    setMessage("");
  };

  return (
    <div>
      {/* Floating Bot Button */}
      <div style={styles.fab} onClick={() => setOpen(!open)}>
        {open ? "×" : "💬"}
      </div>

      {/* Chat Window */}
      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>Ask Me</div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  background: m.from === "user" ? "green" : "#e5e5ea",
                  color: m.from === "user" ? "#fff" : "#000",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={{borderRadius:"30px" ,borderWidth:"1px",backgroundColor:"white",padding:"5px"}}><Micro /></button>
            
            <button style={styles.sendBtn} onClick={sendMessage}> →
            </button>
            
          </div>
        </div>

      )}
    </div>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "green",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  chatWindow: {
    position: "fixed",
    bottom: 90,
    right: 20,
    width: 300,
    height: 400,
    background: "beige",
    borderRadius: 10,
    boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
  },
  header: {
    padding: 10,
    background: "green",
    color: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  messages: {
    flex: 1,
    padding: 10,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  message: {
    maxWidth: "75%",
    padding: "6px 10px",
    borderRadius: 6,
    fontSize: 14,
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    border: "none",
    padding: 8,
    outline: "none",
    borderRadius:"25px"

  },

sendBtn: {
  fontsize: "30px",
  padding: "5px",
  border: "1px",
  borderRadius: "50%",
  backgroundColor: "green",
  color:" #fff",
  
}

};
export default ChatBot

