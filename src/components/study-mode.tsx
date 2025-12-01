import React, { useState, useCallback, useEffect } from 'react';
import type { Flashcard as FlashcardData } from '@/lib/flashcard-service';
import Flashcard from './flashcard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StudyModeProps {
  flashcards: FlashcardData[];
}

const StudyMode: React.FC<StudyModeProps> = ({ flashcards }) => {
  const total = flashcards.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const clampIndex = useCallback(
    (index: number) => {
      if (index < 0) return total - 1;
      if (index >= total) return 0;
      return index;
    },
    [total]
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => clampIndex(prev + 1));
  }, [clampIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => clampIndex(prev - 1));
  }, [clampIndex]);

  useEffect(() => {
    if (total === 0) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, handlePrev, total]);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No flashcards to display.
      </div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <Card className="w-full max-w-md mx-auto p-6 flex flex-col items-center justify-between min-h-[350px] shadow-lg">
      <CardContent className="flex-grow flex items-center justify-center p-0">
        <Flashcard flashcard={card} />
      </CardContent>

      <div className="flex items-center justify-between w-full mt-6">
        <Button onClick={handlePrev} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium">
          {currentIndex + 1} / {total}
        </span>

        <Button onClick={handleNext} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default StudyMode;
