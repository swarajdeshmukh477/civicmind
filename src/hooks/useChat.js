import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are CivicMind, an expert, neutral, and structured civic education AI assistant.
Your goal is to provide comprehensive, accurate, and easy-to-understand information about the election process, voting registration, polling places, and civic duties.
Always behave like a helpful, conversational AI (like ChatGPT). Provide related context, references, and offer follow-up assistance.
Do not hallucinate specific dates or locations unless they are globally applicable; always remind users to check their local election office.
If a user asks a non-civic question, politely steer the conversation back to civic education.`;

export const useChat = (apiKey) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store chat session instance
  const chatSessionRef = useRef(null);

  const initChatSession = useCallback(() => {
    if (!apiKey) return null;
    
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
    } catch (error) {
      console.error("Failed to initialize AI:", error);
      return null;
    }
  }, [apiKey]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    // Initialize chat session if needed and we have an API key
    if (!chatSessionRef.current && apiKey) {
      chatSessionRef.current = initChatSession();
    }

    const userMessage = { role: 'user', content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!apiKey) {
        throw new Error("API key is missing. Please add it in settings.");
      }

      if (!chatSessionRef.current) {
        throw new Error("Failed to start chat session.");
      }

      // Add a placeholder message for typing effect
      setMessages((prev) => [...prev, { role: 'ai', content: '', isComplete: false }]);

      const response = await chatSessionRef.current.sendMessage({ message: content });
      const aiResponseContent = response.text;

      // Update the placeholder with actual content, still incomplete to trigger typing effect
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { role: 'ai', content: aiResponseContent, isComplete: false };
        return newMessages;
      });

      // Complete message after a delay proportional to text length
      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex] && newMessages[lastIndex].role === 'ai') {
            newMessages[lastIndex] = { ...newMessages[lastIndex], isComplete: true };
          }
          return newMessages;
        });
      }, aiResponseContent.length * 10 + 500);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        // Remove the empty placeholder if it was added
        const filtered = prev.filter(m => m.content !== '');
        return [...filtered, { 
          role: 'ai', 
          content: error.message === "API key is missing. Please add it in settings." 
            ? "⚠️ Please click the Settings icon (⚙️) in the top right to enter your Google Gemini API key first."
            : "I'm sorry, I'm having trouble connecting to the AI. Please verify your API key in settings or try again later.",
          isComplete: true 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, initChatSession]);

  return {
    messages,
    isLoading,
    sendMessage
  };
};
