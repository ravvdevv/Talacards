import React, { useEffect, useState, useRef } from 'react';
import { generateFlashcards, type Flashcard } from '@/lib/flashcard-service';
import StudyMode from './study-mode';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle, Sparkles,  Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
      
      // Auto-generate flashcards when text changes
      useEffect(() => {
        const generate = async () => {
          if (!text.trim()) {
            setFlashcards([]);
            setWarningMessage(null);
            return;
          }
          setIsGenerating(true);
      setError(null);
      setWarningMessage(null); // Clear previous warnings
  
      try {
        const { flashcards: generatedFlashcards, warningMessage: receivedWarning } = await generateFlashcards(text);
        setFlashcards(generatedFlashcards);
        if (receivedWarning) {
          setWarningMessage(receivedWarning);
        }
              } catch (err: any) {
                if (err.status === 500) {
                  setError("Your PDF file was too large for the AI to process. Please try with a smaller file or extract relevant sections.");
                } else {
                  setError(err.message || "Failed to generate flashcards. Please try again.");
                }
                console.error(err);
              } finally {
                setIsGenerating(false);
              }    };
  
    // Add a small delay to prevent too many rapid generations
    const timer = setTimeout(() => {
      generate();
    }, 500);
  
    return () => clearTimeout(timer);
  }, [text]);
  
  const handleRegenerate = async () => {
    setIsLoading(true);
    setError(null);
    setWarningMessage(null); // Clear previous warnings
  
    try {
      const { flashcards: generatedFlashcards, warningMessage: receivedWarning } = await generateFlashcards(text);
      setFlashcards(generatedFlashcards);
      if (receivedWarning) {
        setWarningMessage(receivedWarning);
      }
            } catch (err: any) {
              if (err.status === 500) {
                setError("Your PDF file was too large for the AI to process. Please try with a smaller file or extract relevant sections.");
              } else {
                setError(err.message || "Failed to regenerate flashcards. Please try again.");
              }
              console.error(err);
            } finally {
              setIsLoading(false);
            }  };
    
                // TXT Download Function
                const handleDownloadTxt = () => {
                  const textContent = flashcards.map((card, index) => 
                    `${index + 1}. Question: ${card.question}\n   Answer: ${card.answer}`
                  ).join('\n\n');
                
                  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'flashcards.txt';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(link.href); // Clean up
                };
            
                // PDF Download Function
                const handleDownloadPdf = async () => {
                  if (!pdfContentRef.current) return;
                
                  // Temporarily populate the hidden ref with flashcard content for rendering
                  pdfContentRef.current.innerHTML = flashcards.map(flashcard => `
                    <div style="width: 300px; border: 1px solid #e0e0e0; padding: 15px; margin-bottom: 20px; background-color: #f9f9f9; border-radius: 8px;">
                      <h4 style="font-weight: bold; margin-bottom: 8px; font-size: 1.1em; color: #333;">Question:</h4>
                      <p style="margin-bottom: 15px; font-size: 1em; color: #555;">${flashcard.question}</p>
                      <h4 style="font-weight: bold; margin-top: 15px; margin-bottom: 8px; font-size: 1.1em; color: #333;">Answer:</h4>
                      <p style="font-size: 1em; color: #555;">${flashcard.answer}</p>
                    </div>
                  `).join('');
                
                  try {
                    const canvas = await html2canvas(pdfContentRef.current, { scale: 2 }); // Higher scale for better quality
                    const imgData = canvas.toDataURL('image/png');
                
                    const doc = new jsPDF({
                      unit: "pt",
                      format: "letter",
                      orientation: "portrait",
                    });
                
                    const margin = 20;
                    let imgWidth = doc.internal.pageSize.width - 2 * margin;
                    let imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let y = margin;
                
                    if (imgHeight > doc.internal.pageSize.height - 2 * margin) { // If content exceeds one page
                      const ratio = (doc.internal.pageSize.height - 2 * margin) / imgHeight;
                      imgHeight = doc.internal.pageSize.height - 2 * margin;
                      imgWidth = imgWidth * ratio;
                    }
                
                    doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
                
                    doc.save('flashcards.pdf');
                  } catch (error) {
                    console.error("Error generating PDF:", error);
                    // Optionally, show an alert to the user
                    setWarningMessage("Failed to generate PDF. Please try again.");
                  } finally {
                    // Clear the hidden ref content
                    pdfContentRef.current.innerHTML = '';
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