import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    const apiKey = "AIzaSyAD4hYBWn0vjY90KZreED-DLYVdTDkwm2o"; // Using the user's key from .env
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        const result = await genAI.listModels();
        console.log("Available models:");
        result.models.forEach(m => console.log(m.name));
    } catch (e) {
        console.error("Failed to list models:", e.message);
    }
}

listModels();
