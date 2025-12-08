// API Configuration
export const AI_API_URL = 'https://text.pollinations.ai/openai';
export const AI_MODEL = 'openai';
export const MAX_TOKENS = 1000;

// Text Processing
export const MAX_INPUT_CHARS = 7000;
export const DEBOUNCE_DELAY_MS = 500;

// Local Storage
export const LOCAL_STORAGE_KEY = 'talacards-flashcards';

// File Limits
export const MAX_PDF_SIZE_MB = 10;

// Error Messages
export const ERROR_MESSAGES = {
  PDF_TOO_LARGE: 'Your PDF file was too large for the AI to process. Please try with a smaller file or extract relevant sections.',
  GENERATION_FAILED: 'Failed to generate flashcards. Please try again.',
  INVALID_JSON: 'Failed to parse flashcards: The AI response was not valid JSON. Please try with a different text or contact support if the issue persists.',
  NO_CONTENT: 'No content received from AI for flashcards.',
  PDF_PROCESSING_ERROR: 'Error processing PDF. Please try another file.',
  PDF_GENERATION_ERROR: 'Failed to generate PDF. Please try again.',
} as const;

// System Prompts
export const FLASHCARD_SYSTEM_PROMPT = `You are an AI learning assistant that creates effective flashcards to help students study and retain information.

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

Do not include explanations, summaries, or notes outside the flashcard format.`;
