import React, { useState } from "react"
import { Zap } from "lucide-react"
import PdfParser from "@/components/pdf-parser"
import FlashcardDisplayArea from "@/components/flashcard-display-area"

export default function Hero() {
  const [extractedPdfText, setExtractedPdfText] = useState('');
  const [flashcardText, setFlashcardText] = useState('');

  return (
    <div className="container py-8 sm:py-10 lg:py-12 max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Column: Upload and Process */}
        <div className="w-full lg:w-2/5 space-y-4">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transform PDFs to Flashcards
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Upload your study materials and instantly generate interactive flashcards.
            </p>
          </div>
          <div className="pt-1">
            <PdfParser
              setExtractedPdfText={setExtractedPdfText}
              setFlashcardText={setFlashcardText}
            />
          </div>
        </div>

        {/* Right Column: Flashcard Display */}
        <div className="w-full lg:w-3/5 flex justify-center items-stretch min-h-[400px]">
          <FlashcardDisplayArea text={flashcardText} />
        </div>
      </div>
    </div>
  )
}