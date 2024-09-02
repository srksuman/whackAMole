/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState } from 'react';
import { Circle, Hammer, Target, X } from 'lucide-react';
import { HoleState } from '../types/game.type';

interface GameProps {
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    misses: number;
    setMisses: React.Dispatch<React.SetStateAction<number>>;
    moles: boolean[];
    setMoles: (moles: boolean[]) => void;
    holeStates: HoleState[];
    setHoleStates: React.Dispatch<React.SetStateAction<HoleState[]>>;
    hideMole: (index: number) => void;
}

const Game: React.FC<GameProps> = ({
    score,
    setScore,
    misses,
    setMisses,
    moles,
    setMoles,
    holeStates,
    setHoleStates,
    hideMole
}) => {
    const [hitAnimation, setHitAnimation] = useState<number | null>(null);

    const whackMole = (index: number) => {
        setHitAnimation(index);
        setTimeout(() => setHitAnimation(null), 300);

        setHoleStates((prev: HoleState[]) => {
            const newStates: HoleState[] = [...prev];
            if (moles[index]) {
                setScore((prev: number) => prev + 1);
                hideMole(index);
                newStates[index] = 'hit';
            } else {
                setMisses((prev: number) => prev + 1);
                newStates[index] = 'miss';
            }
            return newStates;
        });

        setTimeout(() => {
            setHoleStates((prev: any) => {
                const newStates = [...prev];
                newStates[index] = 'normal';
                return newStates;
            });
        }, 300);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex justify-between w-full max-w-[280px] mb-4">
                <div className="flex items-center">
                    <Target className="w-6 h-6 mr-2 text-green-600" />
                    <span className="text-xl font-bold">Hits: {score}</span>
                </div>
                <div className="flex items-center">
                    <X className="w-6 h-6 mr-2 text-red-600" />
                    <span className="text-xl font-bold">Misses: {misses}</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-[280px]">
                {moles.map((mole, index) => (
                    <button
                        key={index}
                        className={`w-[80px] h-[80px] rounded-[5px] flex items-center justify-center p-0 relative overflow-hidden ${holeStates[index] === 'hit'
                            ? 'bg-green-500'
                            : holeStates[index] === 'miss'
                                ? 'bg-red-500'
                                : 'bg-brown-600'
                            } transition-colors duration-300`}
                        onClick={() => whackMole(index)}
                    >
                        {mole && (
                            <div className="absolute inset-0 flex items-center justify-center animate-rise">
                                <div className="w-3/4 h-3/4 bg-gray-800 rounded-full flex items-center justify-center">
                                    <Circle className="text-white w-1/2 h-1/2" />
                                </div>
                            </div>
                        )}
                        {hitAnimation === index && (
                            <div className="absolute inset-0 flex items-center justify-center animate-hit">
                                <Hammer className="text-white w-2/3 h-2/3" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Game;