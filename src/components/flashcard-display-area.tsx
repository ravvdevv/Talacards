import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import FlashcardGenerator from './flashcard-generator';

interface FlashcardDisplayAreaProps {
  text: string;
}

const FlashcardDisplayArea: React.FC<FlashcardDisplayAreaProps> = ({ text }) => {
  return (
    <div className="w-full h-full flex flex-col">
    
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden">
        {text ? (
          <div className="p-6 h-full overflow-y-auto">
            <FlashcardGenerator text={text} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="relative p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <BookOpen className="h-16 w-16 text-primary" />
                <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to Create Flashcards?
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              Upload a PDF document and our AI will automatically generate interactive flashcards 
              to help you study more effectively.
            </p>

            <div className="flex flex-col gap-3 text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 max-w-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <span>Extract key concepts automatically</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <span>Generate questions and answers</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <span>Study with interactive flip cards</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardDisplayArea;