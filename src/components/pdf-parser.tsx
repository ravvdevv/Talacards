import React, { useState, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { Input } from '@/components/ui/input';
import { UploadCloud } from 'lucide-react';

// Set up the worker source for pdfjs-dist
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfParserProps {
  setExtractedPdfText: (text: string) => void;
  setFlashcardText: (text: string) => void;
}

const PdfParser: React.FC<PdfParserProps> = ({ setExtractedPdfText, setFlashcardText }) => {
  const [localExtractedPdfText, setLocalExtractedPdfText] = useState(''); // Local state to hold text before processing
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName('');
      setLocalExtractedPdfText('');
      setExtractedPdfText('');
      setFlashcardText('');
      return;
    }

    setFileName(file.name);
    setFlashcardText('Processing PDF...');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument(arrayBuffer).promise;
      let pdfText = '';

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
        pdfText += pageText + '\n';
      }

      setLocalExtractedPdfText(pdfText);
      setExtractedPdfText(pdfText);
      
      // Automatically generate flashcards after processing
      setFlashcardText(pdfText);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setFlashcardText('Error processing PDF. Please try another file.');
      setFileName('');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Removed the separate process button handler as we're now doing it automatically

  return (
    <div className="w-full mt-4">
      <div className="w-full">
        <div
          className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={handleButtonClick}
        >
          <UploadCloud className="w-10 h-10 text-gray-400" />
          <h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">
            {fileName || 'Click to upload PDF'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {fileName ? 'File selected' : 'PDF (max. 10MB)'}
          </p>
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
        {!localExtractedPdfText && (
          <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
            Upload a PDF to generate flashcards automatically
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfParser;
