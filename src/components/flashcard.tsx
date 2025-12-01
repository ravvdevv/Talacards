import React, { useState } from 'react';
import type { Flashcard as FlashcardData } from '@/lib/flashcard-service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FlashcardProps {
  flashcard: FlashcardData;
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-[500px] h-[350px] [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <Card className="w-full h-full shadow-lg flex flex-col">
            <CardHeader className="flex items-center justify-center pt-5">
              <h3 className="text-xl font-semibold">Question</h3>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center text-center overflow-y-auto p-6 min-h-[250px]">
              <p className="text-xl font-bold">{flashcard.question}</p>
            </CardContent>
          </Card>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Card className="w-full h-full shadow-lg flex flex-col">
            <CardHeader className="flex items-center justify-center pt-5">
              <h3 className="text-xl font-semibold">Answer</h3>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center text-center overflow-y-auto p-6 min-h-[250px]">
              <p className="text-base">{flashcard.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
