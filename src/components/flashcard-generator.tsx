import React, { useEffect, useState, useRef } from 'react';
import { generateFlashcards, type Flashcard } from '@/lib/flashcard-service';
import { ERROR_MESSAGES, DEBOUNCE_DELAY_MS } from '@/lib/constants';
import { downloadFlashcardsAsTxt, downloadFlashcardsAsPdf } from '@/lib/download-utils';
import StudyMode from './study-mode';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle, Sparkles,  Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FlashcardGeneratorProps {
  text: string;
}

const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({ text }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Common error handling logic
  const handleGenerateError = (err: Error & { status?: number }) => {
    if (err.status === 500) {
      setError(ERROR_MESSAGES.PDF_TOO_LARGE);
    } else {
      setError(err.message || ERROR_MESSAGES.GENERATION_FAILED);
    }
    console.error(err);
  };

  // Common flashcard generation logic
  const generateAndSetFlashcards = async () => {
    setError(null);
    setWarningMessage(null);
    
    try {
      const { flashcards: generatedFlashcards, warningMessage: receivedWarning } = await generateFlashcards(text);
      setFlashcards(generatedFlashcards);
      if (receivedWarning) {
        setWarningMessage(receivedWarning);
      }
    } catch (err) {
      handleGenerateError(err as Error & { status?: number });
      throw err;
    }
  };
      
      // Auto-generate flashcards when text changes
      useEffect(() => {
        const generate = async () => {
          if (!text.trim()) {
            setFlashcards([]);
            setWarningMessage(null);
            return;
          }
          setIsGenerating(true);
      
          try {
            await generateAndSetFlashcards();
          } catch {
            // Error already handled in generateAndSetFlashcards
          } finally {
            setIsGenerating(false);
          }
        };
  
    // Add a small delay to prevent too many rapid generations
    const timer = setTimeout(() => {
      generate();
    }, DEBOUNCE_DELAY_MS);
  
    return () => clearTimeout(timer);
  }, [text]);
  
  const handleRegenerate = async () => {
    setIsLoading(true);
  
    try {
      await generateAndSetFlashcards();
    } catch {
      // Error already handled in generateAndSetFlashcards
    } finally {
      setIsLoading(false);
    }
  };
    
  // TXT Download Function
  const handleDownloadTxt = () => {
    downloadFlashcardsAsTxt(flashcards);
  };

  // PDF Download Function
  const handleDownloadPdf = async () => {
    try {
      await downloadFlashcardsAsPdf(flashcards, pdfContentRef);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setWarningMessage(ERROR_MESSAGES.PDF_GENERATION_ERROR);
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div ref={pdfContentRef} style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px', 
        width: 'auto', 
        padding: '20px', 
        backgroundColor: '#ffffff', // Explicitly white, not a variable that might use oklch
        color: '#000000',           // Explicitly black
        fontFamily: 'Arial, sans-serif' // Safe font family
      }}>
        {/* Flashcards will be rendered here for PDF generation */}
      </div>
      {/* Header with count and regenerate button */}
      {!isGenerating && flashcards.length > 0 && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <span className="text-sm font-bold text-primary">{flashcards.length}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Flashcards Ready
              </h3>
              <p className="text-xs text-muted-foreground">Click any card to start studying</p>
            </div>
          </div>
          
          <div className="flex gap-2"> {/* New div to group buttons */}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleDownloadTxt}
              disabled={isLoading || flashcards.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              TXT
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPdf}
              disabled={isLoading || flashcards.length === 0}
              className="gap-2 hover:bg-primary/5"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerate}
              disabled={isLoading}
              className="gap-2 hover:bg-primary/5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        </div>
                )}
          
                {warningMessage && (
                  <Alert variant="default" className="mb-4 border-yellow-500/50 bg-yellow-500/5 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription>
                      <p className="font-medium text-base mb-1">Warning</p>
                      <p className="text-sm opacity-90">{warningMessage}</p>
                    </AlertDescription>
                  </Alert>
                )}
          
                {/* Loading State */}
                {isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Generating Your Flashcards
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Our AI is analyzing your content and creating study materials...
                    </p>
                    <div className="mt-6 flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : error ? (        /* Error State */
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="flex flex-col gap-3">
            <div>
              <p className="font-medium text-base mb-1">Unable to Generate Flashcards</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerate}
              disabled={isLoading}
              className="w-fit gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      ) : flashcards.length > 0 ? (
        /* Study Mode */
        <div className="flex-1 min-h-0">
          <StudyMode flashcards={flashcards} />
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="p-4 bg-muted/30 rounded-2xl mb-4">
            <Sparkles className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            No flashcards generated yet. Upload a PDF to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;