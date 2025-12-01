import React, { useState } from 'react';
import type { Flashcard as FlashcardData } from '@/lib/flashcard-service';
import { Card, CardContent } from '@/components/ui/card';

interface FlashcardProps {
  flashcard: FlashcardData;
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-[300px] h-[200px] [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <Card className="w-full h-full shadow-lg">
           
              <h3 className="font-semibold text-center">Question</h3>
            <CardContent className=" flex items-center justify-center text-center min-h-[120px]">
              <p className="text-xl font-bold">{flashcard.question}</p>
            </CardContent>
          </Card>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Card className="w-full h-full shadow-lg flex flex-col">
            <h3 className="text-lg font-semibold text-center">Answer</h3>
            <CardContent className="pt-2 flex-grow flex items-center justify-center text-center min-h-[120px]">
              <p className="text-xl font-bold">{flashcard.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
