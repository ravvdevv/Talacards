import {
  MAX_INPUT_CHARS,
  AI_API_URL,
  AI_MODEL,
  MAX_TOKENS,
  LOCAL_STORAGE_KEY,
  ERROR_MESSAGES,
  FLASHCARD_SYSTEM_PROMPT,
} from './constants';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

/**
 * Extracts JSON content from AI response that might be wrapped in markdown or other text
 */
const extractJsonFromResponse = (content: string): string => {
  // Try to extract JSON from markdown code block
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1];
  }
  
  // Fallback to trying to find the first array if no markdown block
  const arrayMatch = content.match(/[\[][\s\S]*?[\]]/);
  
  if (arrayMatch) {
    return arrayMatch[0];
  }
  
  // Return original content if no patterns match
  return content;
};

export const generateFlashcards = async (text: string): Promise<{ flashcards: Flashcard[]; warningMessage: string | null }> => {
  let processedText = text;
  let warningMessage: string | null = null;

  if (text.length > MAX_INPUT_CHARS) {
    processedText = text.substring(0, MAX_INPUT_CHARS) + "\n\n... (content truncated due to character limit)";
    warningMessage = `Your input text was too long (${text.length} characters) and has been truncated to ${MAX_INPUT_CHARS} characters. Some content might be missing.`;
    console.warn(`Input text truncated from ${text.length} to ${MAX_INPUT_CHARS} characters.`);
  }

  const payload = {
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: FLASHCARD_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `Create flashcards from the following text:\n\n${processedText}\n\nOnly proceed if the content is a valid academic lesson. Otherwise, respond with the 'invalid-input' format as instructed.`,
      },
    ],
    max_tokens: MAX_TOKENS,
  };

  try {
    const response = await fetch(AI_API_URL, {
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
      const error = new Error(`AI API error: ${response.status} ${response.statusText}`) as Error & { status: number };
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const aiResponseContent = data?.choices?.[0]?.message?.content;

    if (aiResponseContent) {
      try {
        const jsonString = extractJsonFromResponse(aiResponseContent);
        const parsedResponse = JSON.parse(jsonString);

        if (Array.isArray(parsedResponse) && parsedResponse[0]?.flashcardId === 'invalid-input') {
          const reason = parsedResponse[0]?.name || "The provided content is not a valid academic lesson.";
          throw new Error(reason);
        }

        const flashcards: { question: string; answer: string }[] = parsedResponse;

        return {
          flashcards: flashcards.map((card, index) => ({
            id: `flashcard-${index}`,
            question: card.question,
            answer: card.answer,
          })),
          warningMessage,
        };
      } catch (parseError) {
        console.error("Failed to parse AI response content as JSON:", aiResponseContent, parseError);
        throw new Error(ERROR_MESSAGES.INVALID_JSON);
      }
    } else {
      throw new Error(ERROR_MESSAGES.NO_CONTENT);
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error; // Re-throw the error to be caught by the calling component
  }
};

export const saveFlashcardsToLocalStorage = (flashcards: Flashcard[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flashcards));
    console.log('Flashcards saved to local storage.');
  } catch (error) {
    console.error('Failed to save flashcards to local storage:', error);
  }
};

export const loadFlashcardsFromLocalStorage = (): Flashcard[] => {
  try {
    const storedFlashcards = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedFlashcards) {
      console.log('Flashcards loaded from local storage.');
      return JSON.parse(storedFlashcards) as Flashcard[];
    }
  } catch (error) {
    console.error('Failed to load flashcards from local storage:', error);
  }
  return [];
};