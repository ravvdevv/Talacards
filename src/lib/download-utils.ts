import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Flashcard } from './flashcard-service';

/**
 * Downloads flashcards as a plain text file
 */
export const downloadFlashcardsAsTxt = (flashcards: Flashcard[]): void => {
  const textContent = flashcards
    .map((card, index) => `${index + 1}. Question: ${card.question}\n   Answer: ${card.answer}`)
    .join('\n\n');

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'flashcards.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Generates HTML content for flashcards to be used in PDF generation
 */
export const generateFlashcardHtml = (flashcards: Flashcard[]): string => {
  return flashcards
    .map(
      (flashcard) => `
    <div style="width: 300px; border: 1px solid #e0e0e0; padding: 15px; margin-bottom: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <h4 style="font-weight: bold; margin-bottom: 8px; font-size: 1.1em; color: #333;">Question:</h4>
      <p style="margin-bottom: 15px; font-size: 1em; color: #555;">${flashcard.question}</p>
      <h4 style="font-weight: bold; margin-top: 15px; margin-bottom: 8px; font-size: 1.1em; color: #333;">Answer:</h4>
      <p style="font-size: 1em; color: #555;">${flashcard.answer}</p>
    </div>
  `
    )
    .join('');
};

/**
 * Downloads flashcards as a PDF file
 */
export const downloadFlashcardsAsPdf = async (
  flashcards: Flashcard[],
  containerRef: React.RefObject<HTMLDivElement | null>
): Promise<void> => {
  if (!containerRef.current) {
    throw new Error('Container reference is not available');
  }

  // Temporarily populate the hidden ref with flashcard content for rendering
  containerRef.current.innerHTML = generateFlashcardHtml(flashcards);

  try {
    const canvas = await html2canvas(containerRef.current, { scale: 2 }); // Higher scale for better quality
    const imgData = canvas.toDataURL('image/png');

    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
      orientation: 'portrait',
    });

    const margin = 20;
    let imgWidth = doc.internal.pageSize.width - 2 * margin;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = margin;

    if (imgHeight > doc.internal.pageSize.height - 2 * margin) {
      // If content exceeds one page
      const ratio = (doc.internal.pageSize.height - 2 * margin) / imgHeight;
      imgHeight = doc.internal.pageSize.height - 2 * margin;
      imgWidth = imgWidth * ratio;
    }

    doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
    doc.save('flashcards.pdf');
  } finally {
    // Clear the hidden ref content
    containerRef.current.innerHTML = '';
  }
};
