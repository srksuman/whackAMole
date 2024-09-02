import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game.type';
import { COUNTRIES, TIME_OPTIONS } from '../constants/assets.constant';

interface LeaderboardProps {
    leaderboard: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
    const [leaderboardFilter, setLeaderboardFilter] = useState({ time: 'all', country: 'all' });

    const filteredLeaderboard = leaderboard.filter(entry =>
        (leaderboardFilter.time === 'all' || entry.time === Number(leaderboardFilter.time)) &&
        (leaderboardFilter.country === 'all' || entry.country === leaderboardFilter.country)
    );

    return (
        <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <div className="w-full flex justify-between">
                <select
                    value={leaderboardFilter.time}
                    onChange={(e) => setLeaderboardFilter(prev => ({ ...prev, time: e.target.value }))}
                    className="p-2 border rounded"
                >
                    <option value="all">All Times</option>
                    {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{time} seconds</option>
                    ))}
                </select>
                <select
                    value={leaderboardFilter.country}
                    onChange={(e) => setLeaderboardFilter(prev => ({ ...prev, country: e.target.value }))}
                    className="p-2 border rounded"
                >
                    <option value="all">All Countries</option>
                    {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </div>
            <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-2 bg-gray-100 font-bold flex">
                    <span className="w-1/4">Name</span>
                    <span className="w-1/4">Country</span>
                    <span className="w-1/4 text-center">Score</span>
                    <span className="w-1/4 text-right">Time</span>
                </div>
                {filteredLeaderboard.map((entry, index) => (
                    <div key={index} className="px-4 py-2 flex border-t">
                        <span className="w-1/4">{entry.name}</span>
                        <span className="w-1/4">{entry.country}</span>
                        <span className="w-1/4 text-center">{entry.score}</span>
                        <span className="w-1/4 text-right">{entry.time}s</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;