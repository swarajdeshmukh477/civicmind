import { useState, useCallback } from 'react';

// Mock AI service for demonstration purposes
const generateMockResponse = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let response = "I'm not sure about that specific question, but I can help you with voter registration, finding polling places, or understanding voting requirements.";
      
      if (lowerQuery.includes('register')) {
        response = "To register to vote, you typically need to meet age and citizenship requirements. Most states allow you to register online, by mail, or in person at designated government offices like the DMV. Do you need help finding the specific registration portal for your state?";
      } else if (lowerQuery.includes('where') || lowerQuery.includes('polling') || lowerQuery.includes('booth')) {
        response = "You can usually find your polling place by visiting your state's Election Office website or your local county clerk's website. They provide lookup tools where you enter your registered address to find your exact voting location.";
      } else if (lowerQuery.includes('id') || lowerQuery.includes('bring')) {
        response = "Voter ID requirements vary widely by state. Some require a photo ID (like a driver's license or passport), some accept non-photo IDs (like a utility bill), and some don't require ID at all to cast a regular ballot. It's crucial to check your specific state's rules before heading to the polls.";
      } else if (lowerQuery.includes('how') && lowerQuery.includes('vote')) {
        response = "There are generally three ways to vote: in-person on Election Day, early voting in-person (available in most states), or voting by mail/absentee ballot. Which method are you most interested in learning about?";
      }

      resolve(response);
    }, 1000 + Math.random() * 1500); // Simulate network delay
  });
};

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Fetch AI response (using mock service here)
      const aiResponseContent = await generateMockResponse(content);
      
      const aiMessage = { role: 'ai', content: aiResponseContent, isComplete: false };
      
      // Add initial AI message
      setMessages((prev) => [...prev, aiMessage]);

      // Simulate completion after a delay to allow typing effect
      // In a real streaming scenario, this logic would handle chunks
      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === 'ai') {
            newMessages[lastIndex] = { ...newMessages[lastIndex], isComplete: true };
          }
          return newMessages;
        });
      }, aiResponseContent.length * 15 + 500); // Rough estimate based on typing speed

    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isComplete: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage
  };
};
