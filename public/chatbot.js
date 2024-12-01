document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
  
    // Function to add a message to the chat
    const addMessage = (message, sender) => {
      const messageBubble = document.createElement("div");
      messageBubble.classList.add("chat-bubble", sender === "user" ? "user-message" : "bot-message");
  
      const timestamp = document.createElement("span");
      timestamp.classList.add("message-timestamp");
      timestamp.textContent = new Date().toLocaleTimeString();
  
      const textContent = document.createElement("p");
      textContent.textContent = message;
  
      messageBubble.appendChild(textContent);
      messageBubble.appendChild(timestamp);
      chatBox.appendChild(messageBubble);
      chatBox.scrollTop = chatBox.scrollHeight;
    };
  
    // Function to send user query to server
    const sendQuery = async (query) => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        addMessage(data.response || "No response from server.", "bot");
      } catch (error) {
        addMessage("Sorry, there was an error processing your request. Please try again.", "bot");
      }
    };
  
    // Handle send button click
    sendBtn.addEventListener("click", () => {
      const query = userInput.value.trim();
      if (query) {
        addMessage(query, "user");
        sendQuery(query);
        userInput.value = "";
      }
    });
  
    // Allow Enter key to send a message
    userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendBtn.click();
      }
    });
  });
  