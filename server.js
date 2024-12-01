const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // For loading API keys from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // API Key from .env
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).json({ error: "Query is required." });
    }

    try {
        const result = await model.generateContent(userQuery);
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Error generating content:", error.message);
        res.status(500).json({ error: "Failed to process the request." });
    }
});

// Serve static files (frontend)
app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
