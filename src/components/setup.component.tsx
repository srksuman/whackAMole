import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { COUNTRIES, TIME_OPTIONS } from "../constants/assets.constant";

interface SetupProps {
    playerName: string;
    setPlayerName: (name: string) => void;
    playerCountry: string;
    setPlayerCountry: (country: string) => void;
    selectedTime: number;
    setSelectedTime: (time: number) => void;
    startGame: () => void;
}

const Setup: React.FC<SetupProps> = ({
    playerName,
    setPlayerName,
    playerCountry,
    setPlayerCountry,
    selectedTime,
    setSelectedTime,
    startGame
}) => {
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const filteredCountries = COUNTRIES.filter(country =>
        country.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full max-w-xs p-2 border rounded"
            />
            <div className="relative w-full max-w-xs">
                <div className="flex items-center border rounded">
                    <input
                        type="text"
                        placeholder="Select your country"
                        value={playerCountry}
                        onChange={(e) => {
                            setPlayerCountry(e.target.value);
                            setCountrySearch(e.target.value);
                            setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        className="w-full p-2 rounded-l"
                    />
                    <button
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="p-2 rounded-r"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>
                {showCountryDropdown && (
                    <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                        {filteredCountries.map((country, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setPlayerCountry(country);
                                    setShowCountryDropdown(false);
                                }}
                            >
                                {country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(Number(e.target.value))}
                className="w-full max-w-xs p-2 border rounded"
            >
                {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time} seconds</option>
                ))}
            </select>
            <button onClick={startGame} disabled={!playerName || !playerCountry}>
                Start Game
            </button>
        </div>
    );
};

export default Setup;