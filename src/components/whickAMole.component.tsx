import React, { useState, useEffect, useCallback, useRef } from "react";
import { PlayCircle, RotateCcw, Trophy, Timer } from "lucide-react";
import Select from 'react-select';
import countryList from 'react-select-country-list';

// Import sound effects
import hitSound from '../assets/sound/miss.mp3';
import missSound from '../assets/sound/hit.mp3';

type GameState = "setup" | "playing" | "finished" | "leaderboard";
type HoleState = "normal" | "active" | "hit" | "miss";

interface LeaderboardEntry {
    name: string;
    score: number;
    time: number;
    country: string;
}

interface CountryOption {
    label: string;
    value: string;
}

const MAX_MOLES = 3;
const INITIAL_MOLE_RATE = 1500;
const MIN_MOLE_RATE = 600;
const DIFFICULTY_INCREASE_RATE = 0.98;

const WhackAMole: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>("setup");
    const [playerName, setPlayerName] = useState("");
    const [playerCountry, setPlayerCountry] = useState("");
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
    const [holeStates, setHoleStates] = useState<HoleState[]>(Array(9).fill("normal"));
    const [moleAppearanceRate, setMoleAppearanceRate] = useState(INITIAL_MOLE_RATE);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [selectedTime, setSelectedTime] = useState(30);
    const [countryOptions, setCountryOptions] = useState<CountryOption[]>(countryList().getData());
    const [leaderboardFilter, setLeaderboardFilter] = useState("all");
    const [countryFilter, setCountryFilter] = useState("all");

    const hitSoundRef = useRef<HTMLAudioElement | null>(null);
    const missSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        hitSoundRef.current = new Audio(hitSound);
        missSoundRef.current = new Audio(missSound);

        const storedName = localStorage.getItem("playerName");
        const storedCountry = localStorage.getItem("playerCountry");
        if (storedName) setPlayerName(storedName);
        if (storedCountry) setPlayerCountry(storedCountry);

        const storedLeaderboard = localStorage.getItem("leaderboard");
        if (storedLeaderboard) setLeaderboard(JSON.parse(storedLeaderboard));
    }, []);

    const updateLeaderboard = useCallback(() => {
        const newEntry = { name: playerName, score, time: selectedTime, country: playerCountry };
        setLeaderboard((prevLeaderboard) => {
            const newLeaderboard = [...prevLeaderboard, newEntry].sort((a, b) => b.score - a.score);
            localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
            return newLeaderboard;
        });
    }, [playerName, score, selectedTime, playerCountry]);

    const showRandomMole = useCallback(() => {
        setMoles((prevMoles) => {
            const activeMoles = prevMoles.filter((mole) => mole).length;
            if (activeMoles >= MAX_MOLES) return prevMoles;

            const newMoles = [...prevMoles];
            const emptyHoles = newMoles.reduce(
                (acc, mole, index) => (!mole ? [...acc, index] : acc),
                [] as number[]
            );
            if (emptyHoles.length > 0) {
                const randomIndex = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
                newMoles[randomIndex] = true;
                setHoleStates((prev) => {
                    const newStates = [...prev];
                    newStates[randomIndex] = "active";
                    return newStates;
                });
            }
            return newMoles;
        });
    }, []);

    const hideMole = useCallback((index: number) => {
        setMoles((prevMoles) => {
            const newMoles = [...prevMoles];
            newMoles[index] = false;
            return newMoles;
        });
        setHoleStates((prev) => {
            const newStates = [...prev];
            newStates[index] = "normal";
            return newStates;
        });
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let moleTimer: NodeJS.Timeout;

        if (gameState === "playing" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        clearTimeout(moleTimer);
                        setGameState("finished");
                        updateLeaderboard();
                        return 0;
                    }
                    return prev - 1;
                });

                setMoleAppearanceRate((prev) =>
                    Math.max(prev * DIFFICULTY_INCREASE_RATE, MIN_MOLE_RATE)
                );
            }, 1000);

            const updateMoles = () => {
                showRandomMole();
                moleTimer = setTimeout(updateMoles, moleAppearanceRate);
            };
            updateMoles();

            // Ensure at least one mole is always visible
            const ensureMoleVisible = setInterval(() => {
                setMoles((prevMoles) => {
                    if (!prevMoles.some(mole => mole)) {
                        const newMoles = [...prevMoles];
                        const randomIndex = Math.floor(Math.random() * newMoles.length);
                        newMoles[randomIndex] = true;
                        setHoleStates((prev) => {
                            const newStates = [...prev];
                            newStates[randomIndex] = "active";
                            return newStates;
                        });
                        return newMoles;
                    }
                    return prevMoles;
                });
            }, 1000);

            return () => {
                clearInterval(timer);
                clearTimeout(moleTimer);
                clearInterval(ensureMoleVisible);
            };
        }
    }, [gameState, timeLeft, moleAppearanceRate, showRandomMole, updateLeaderboard]);

    const startGame = () => {
        if (playerName && playerCountry) {
            localStorage.setItem("playerName", playerName);
            localStorage.setItem("playerCountry", playerCountry);
            setScore(0);
            setMisses(0);
            setTimeLeft(selectedTime);
            setMoles(Array(9).fill(false));
            setHoleStates(Array(9).fill("normal"));
            setMoleAppearanceRate(INITIAL_MOLE_RATE);
            setGameState("playing");
        }
    };

    const resetGame = () => {
        setGameState("setup");
        setScore(0);
        setMisses(0);
        setTimeLeft(selectedTime);
        setMoles(Array(9).fill(false));
        setHoleStates(Array(9).fill("normal"));
        setMoleAppearanceRate(INITIAL_MOLE_RATE);
    };

    const whackMole = (index: number) => {
        if (moles[index]) {
            setScore((prev) => prev + 1);
            hideMole(index);
            setHoleStates((prev) => {
                const newStates = [...prev];
                newStates[index] = "hit";
                setTimeout(() => {
                    setHoleStates((prev) => {
                        const newStates = [...prev];
                        newStates[index] = "normal";
                        return newStates;
                    });
                }, 300);
                return newStates;
            });
            hitSoundRef.current?.play();
        } else {
            setMisses((prev) => prev + 1);
            setHoleStates((prev) => {
                const newStates = [...prev];
                newStates[index] = "miss";
                setTimeout(() => {
                    setHoleStates((prev) => {
                        const newStates = [...prev];
                        newStates[index] = "normal";
                        return newStates;
                    });
                }, 300);
                return newStates;
            });
            missSoundRef.current?.play();
        }
    };

    const handleCountryChange = (selectedOption: CountryOption | null) => {
        setPlayerCountry(selectedOption ? selectedOption.label : '');
    };

    const filteredLeaderboard = leaderboard.filter((entry) => {
        if (leaderboardFilter === "all") return true;
        return entry.time.toString() === leaderboardFilter;
    }).filter((entry) => {
        if (countryFilter === "all") return true;
        return entry.country === countryFilter;
    });

    const uniqueCountries = Array.from(new Set(leaderboard.map(entry => entry.country)));

    return (
        <div className="whack-a-mole">
            <div className="game-container">
                <h1 className="game-title">Whack-a-Mole</h1>
                {gameState === "setup" && (
                    <div className="setup">
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                            className="input"
                        />
                        <Select
                            options={countryOptions}
                            value={countryOptions.find(option => option.label === playerCountry)}
                            onChange={handleCountryChange}
                            placeholder="Select your country"
                            className="country-select"
                            classNamePrefix="country-select"
                        />
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(Number(e.target.value))}
                            className="select"
                        >
                            <option value={30}>30 seconds</option>
                            <option value={60}>60 seconds</option>
                            <option value={90}>90 seconds</option>
                        </select>
                        <button onClick={startGame} className="button start-button">
                            <PlayCircle className="button-icon" />
                            Start Game
                        </button>
                    </div>
                )}
                {gameState === "playing" && (
                    <div className="game-board">
                        <div className="holes-container">
                            {moles.map((mole, index) => (
                                <div
                                    key={index}
                                    className={`hole ${holeStates[index]}`}
                                    onClick={() => whackMole(index)}
                                >
                                    {mole && <div className="mole" />}
                                </div>
                            ))}
                        </div>
                        <div className="game-info">
                            <div className="score">Score: {score}</div>
                            <div className="misses">Misses: {misses}</div>
                            <div className="time-left">Time: {timeLeft}s</div>
                        </div>
                    </div>
                )}
                {gameState === "finished" && (
                    <div className="finished">
                        <h2>Game Over!</h2>
                        <p className="final-score">Your score: {score}</p>
                        <button onClick={resetGame} className="button play-again-button">
                            <RotateCcw className="button-icon" />
                            Play Again
                        </button>
                    </div>
                )}
                {gameState === "leaderboard" && (
                    <div className="leaderboard">
                        <h2>Leaderboard</h2>
                        <div className="leaderboard-filters">
                            <select
                                value={leaderboardFilter}
                                onChange={(e) => setLeaderboardFilter(e.target.value)}
                                className="select"
                            >
                                <option value="all">All Times</option>
                                <option value="30">30 seconds</option>
                                <option value="60">60 seconds</option>
                                <option value="90">90 seconds</option>
                            </select>
                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="select"
                            >
                                <option value="all">All Countries</option>
                                {uniqueCountries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <ul>
                            {filteredLeaderboard.map((entry, index) => (
                                <li key={index} className="leaderboard-entry">
                                    <span className="entry-rank">{index + 1}</span>
                                    <span className="entry-name">{entry.name}</span>
                                    <span className="entry-country">({entry.country})</span>
                                    <span className="entry-score">{entry.score} points</span>
                                    <span className="entry-time">{entry.time}s</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setGameState("setup")} className="button back-button">
                            <PlayCircle className="button-icon" />
                            Back to Game
                        </button>
                    </div>
                )}
            </div>
            <nav className="game-nav">
                <button className="nav-button" onClick={() => setGameState("setup")}>
                    <PlayCircle className="nav-icon" />
                    <span className="nav-label">New Game</span>
                </button>
                <button className="nav-button" onClick={resetGame}>
                    <RotateCcw className="nav-icon" />
                    <span className="nav-label">Reset</span>
                </button>
                <button className="nav-button" onClick={() => setGameState("leaderboard")}>
                    <Trophy className="nav-icon" />
                    <span className="nav-label">Leaderboard</span>
                </button>
            </nav>
        </div>
    );
};

export default WhackAMole;