import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `You are CivicMind, an expert, neutral, and structured civic education AI assistant strictly focused ONLY on the Indian election system.

STRICT OPERATIONAL BOUNDARIES:
- You are ONLY permitted to answer questions related to Indian elections, the Election Commission of India (ECI), Indian voter registration (EPIC), and Indian civic duties.
- If a user asks about elections in the United States, UK, or any other country, you must politely inform them that you are specialized exclusively in the Indian election system.
- If a user asks non-civic questions (e.g., weather, sports, general knowledge), politely steer the conversation back to Indian elections.
- Provide accurate information about Lok Sabha, Vidhan Sabha, and local body elections in India.
- Mention official resources like voters.eci.gov.in and the Voter Helpline App when relevant.

CRITICAL FORMATTING RULES:
For every detailed response, you MUST structure your answer in two parts:
1. An initial summary consisting of exactly 3-4 bullet points, strictly limited to a maximum of 120 words.
2. A separator exactly matching "===SHOW_MORE===" on its own line.
3. The full, detailed explanation and answer following the separator.`;

const FALLBACK_FAQS = [
  {
    keywords: ["epic", "voter id", "card", "registration"],
    summary: "• EPIC (Electors Photo Identity Card) is the official voter ID in India.\n• Apply via Form 6 on the Voter Service Portal.\n• It serves as proof of identity and residence.",
    details: "The Elector's Photo Identity Card (EPIC) is issued by the Election Commission of India. To get one, you must be an Indian citizen aged 18 or older. You can register online at voters.eci.gov.in or via the Voter Helpline App by filling out Form 6. Once processed, your EPIC card will be sent to your registered address."
  },
  {
    keywords: ["evm", "vvpat", "voting", "machine"],
    summary: "• EVMs (Electronic Voting Machines) record votes electronically.\n• VVPAT provides a paper trail for verification.\n• The system is designed to be tamper-proof and secure.",
    details: "Electronic Voting Machines (EVMs) have been used in India since 1999. They consist of a Control Unit and a Balloting Unit. The VVPAT (Voter Verifiable Paper Audit Trail) is an independent system attached to the EVM that allows voters to verify that their votes are cast as intended. When a vote is cast, a slip is printed containing the serial number, name, and symbol of the candidate, visible for 7 seconds."
  },
  {
    keywords: ["lok sabha", "rajya sabha", "parliament", "difference"],
    summary: "• Lok Sabha is the Lower House (House of the People).\n• Rajya Sabha is the Upper House (Council of States).\n• Lok Sabha members are directly elected by citizens.",
    details: "The Indian Parliament is bicameral. The Lok Sabha (Lower House) has a maximum of 543 members directly elected by the people. It has a term of 5 years. The Rajya Sabha (Upper House) is a permanent body with 245 members, where members are elected by the elected members of State Legislative Assemblies. Rajya Sabha members serve a 6-year term, with one-third retiring every two years."
  },
  {
    keywords: ["eligibility", "age", "who can vote"],
    summary: "• Must be an Indian Citizen.\n• Must be 18 years of age or older.\n• Must be a resident of the polling area.",
    details: "To be eligible to vote in India, you must be a citizen of India, 18 years of age on the qualifying date (usually January 1st of the year), and ordinary resident in the constituency where you want to be enrolled. You must not be disqualified due to unsoundness of mind or conviction for certain crimes."
  }
];

const getFallbackAnswer = (query) => {
  const lowerQuery = query.toLowerCase();
  const match = FALLBACK_FAQS.find(faq => 
    faq.keywords.some(keyword => lowerQuery.includes(keyword))
  );
  
  if (match) {
    return `${match.summary}\n===SHOW_MORE===\n${match.details}`;
  }
  
  return `### Offline Intelligence Mode\n\n• **High Demand**: We're currently experiencing heavy traffic. I've switched to my local knowledge base.\n• **Registration Support**: I can still assist with voter registration and ECI portal links.\n• **Recommendation**: Please try refreshing in a moment for a full AI consultation.\n\n===SHOW_MORE===\nYou can access all official services directly at **voters.eci.gov.in**. While my advanced reasoning is temporarily limited by the API quota, I can confirm that voter registration is always open online. For specific results or complex queries, the official ECI portal is your most reliable source until my AI connection is fully restored.`;
};

export const useChat = (apiKey) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store chat session instance
  const chatSessionRef = useRef(null);

  const initChatSession = useCallback(() => {
    console.log("CivicMind: Initializing stable Gemini chat session...");
    if (!apiKey) return null;
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel(
        { model: "gemini-2.0-flash-lite" }
      );
      return model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am CivicMind, and I will strictly follow your instructions to provide neutral, structured information about the Indian election system." }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000,
        },
      });
    } catch (error) {
      console.error("CivicMind: Failed to initialize Gemini AI:", error);
      return null;
    }
  }, [apiKey]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    if (!chatSessionRef.current && apiKey) {
      chatSessionRef.current = initChatSession();
    }

    const userMessage = { role: 'user', content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const saveToHistory = (query) => {
      try {
        const history = JSON.parse(localStorage.getItem('civicmind_history') || '[]');
        if (!history.includes(query)) {
          const newHistory = [query, ...history].slice(0, 20);
          localStorage.setItem('civicmind_history', JSON.stringify(newHistory));
        }
      } catch (e) {
        console.error("Failed to save history:", e);
      }
    };
    saveToHistory(content.trim());

    try {
      if (!apiKey) {
        throw new Error("API key is missing. Please add it in settings.");
      }

      if (!chatSessionRef.current) {
        throw new Error("Failed to start chat session.");
      }

      setMessages((prev) => [...prev, { role: 'ai', content: '', isComplete: false }]);

      const result = await chatSessionRef.current.sendMessage(content);
      const response = await result.response;
      const aiResponseContent = response.text() || "I couldn't generate a response. Please try again.";

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { role: 'ai', content: aiResponseContent, isComplete: false };
        return newMessages;
      });

      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex] && newMessages[lastIndex].role === 'ai') {
            newMessages[lastIndex] = { ...newMessages[lastIndex], isComplete: true };
          }
          return newMessages;
        });
      }, (aiResponseContent?.length || 0) * 10 + 500);

    } catch (error) {
      console.error("CivicMind Chat Error:", error);
      
      const isQuotaError = error.message?.includes("quota") || error.status === 429;
      let errorMessage = "I'm sorry, I'm having trouble connecting to the AI. Please verify your API key in settings or try again later.";
      
      if (error.message?.includes("API key not valid") || error.message?.includes("invalid_api_key")) {
        errorMessage = "⚠️ Your API key appears to be invalid. Please check your settings.";
      } else if (isQuotaError) {
        errorMessage = getFallbackAnswer(content);
      } else if (error.message) {
        errorMessage = `⚠️ AI Error: ${error.message}`;
      }

      setMessages((prev) => {
        const filtered = prev.filter(m => m.content !== '');
        return [...filtered, { 
          role: 'ai', 
          content: errorMessage,
          isError: isQuotaError ? false : true, // Only show error card if not a smart fallback
          isFallback: isQuotaError,
          isComplete: true 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, initChatSession]);

  const stopGeneration = useCallback(() => {
    setIsLoading(false);
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([]);
    chatSessionRef.current = null;
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    stopGeneration,
    resetMessages
  };
};
