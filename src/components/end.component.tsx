import React from 'react';

interface FinishedProps {
    score: number;
    resetGame: () => void;
}

const Finished: React.FC<FinishedProps> = ({ score, resetGame }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-2xl font-bold">Game Over!</div>
            <div>Your score: {score}</div>
            <button onClick={resetGame}>
                Play Again
            </button>
        </div>
    );
};

export default Finished;