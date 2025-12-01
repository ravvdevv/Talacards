
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
  const payload = {
    model: "openai",
    messages: [
      {
        role: "system",
        content: `You are an AI learning assistant that creates effective flashcards to help students study and retain information.

  Before generating flashcards, first verify that the provided content is a valid academic lesson typically found in school or university curricula (e.g., mathematics, biology, history, computer science, etc.).

  If the extracted content is **not related to any academic subject** or **not suitable for educational flashcards** (e.g., personal stories, random internet text, opinions, fictional content), respond with:
  [{
    name: {reason why it's not valid},
    flashcardId: 'invalid-input',
    cards: []
  }]

  If valid, your task is to extract key concepts, terms, and facts from the academic content and create a maximum of 25 flashcards in simple Q&A format for active recall.

  Each flashcard should:
  - Focus on one clear concept
  - Use simple and direct language
  - Be useful for review and retention

  Do not include explanations, summaries, or notes outside the flashcard format.`
      },
      {
        role: "user",
        content: `Create flashcards from the following text:\n\n${text}\n\nOnly proceed if the content is a valid academic lesson. Otherwise, respond with the 'invalid-input' format as instructed.`,
      },
    ],
    max_tokens: 1000,
  };

  try {
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // IMPORTANT: Replace 'YOUR_TOKEN' with your actual authorization token.
        // In a production environment, consider loading this from an environment variable.
        "Authorization": `Bearer ${import.meta.env.API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API Error:", errorData);
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponseContent = data?.choices?.[0]?.message?.content;

    if (aiResponseContent) {
      try {
        const parsedResponse = JSON.parse(aiResponseContent);

        if (Array.isArray(parsedResponse) && parsedResponse[0]?.flashcardId === 'invalid-input') {
          const reason = parsedResponse[0]?.name || "The provided content is not a valid academic lesson.";
          throw new Error(reason);
        }

        const flashcards: { question: string; answer: string }[] = parsedResponse;
        return flashcards.map((card, index) => ({
          id: `flashcard-${index}`,
          question: card.question,
          answer: card.answer,
        }));
      } catch (parseError) {
        console.error("Failed to parse AI response content as JSON:", aiResponseContent, parseError);
        throw new Error("Failed to parse flashcards: The AI response was too long or malformed. Please try with a shorter text or different content.");
      }
    } else {
      throw new Error("No content received from AI for flashcards.");
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error; // Re-throw the error to be caught by the calling component
  }
};
