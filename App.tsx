
import React, { useState, useCallback, useEffect } from 'react';

// --- SVG Icons --- //
const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
);


// --- Main App Component --- //
export default function App() {
  const [nameInput, setNameInput] = useState<string>('');
  const [allNames, setAllNames] = useState<string[]>([]);
  const [remainingNames, setRemainingNames] = useState<string[]>([]);
  const [pickedNames, setPickedNames] = useState<string[]>([]);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [animationName, setAnimationName] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNameInput = event.target.value;
    setNameInput(newNameInput);
    const names = newNameInput.split('\n').map(name => name.trim()).filter(name => name !== '');
    setAllNames(names);
    setRemainingNames(names);
    setPickedNames([]);
    setCurrentWinner(null);
  };

  const handleReset = useCallback(() => {
    setRemainingNames(allNames);
    setPickedNames([]);
    setCurrentWinner(null);
  }, [allNames]);

  const handlePickWinner = useCallback(() => {
    if (remainingNames.length === 0 || isPicking) return;
    
    setIsPicking(true);
    setCurrentWinner(null);

    const animationDuration = 2000;
    const sliceSize = Math.max(1, Math.floor(remainingNames.length / 10));
    const nameSlice = [...remainingNames].sort(() => 0.5 - Math.random()).slice(0, 15);

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * nameSlice.length);
      setAnimationName(nameSlice[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const winnerIndex = Math.floor(Math.random() * remainingNames.length);
      const winner = remainingNames[winnerIndex];
      
      setCurrentWinner(winner);
      setAnimationName(null);
      
      const newRemaining = remainingNames.filter((_, index) => index !== winnerIndex);
      setRemainingNames(newRemaining);
      setPickedNames(prevPicked => [...prevPicked, winner]);
      setIsPicking(false);
    }, animationDuration);
  }, [remainingNames, isPicking]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Raffle from a Bag
          </h1>
          <p className="text-slate-400 mt-2">Paste your list of names, and draw winners one by one.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Input and Remaining Names */}
          <div className="flex flex-col gap-8">
            <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                <ClipboardIcon className="w-6 h-6"/>
                Enter Names
              </h2>
              <textarea
                value={nameInput}
                onChange={handleInputChange}
                placeholder="Paste names here, one per line..."
                className="w-full h-48 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none"
              />
              <p className="text-right text-sm text-slate-500 mt-2">{allNames.length} names loaded</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700 flex-grow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                <UsersIcon className="w-6 h-6"/>
                Remaining in Raffle ({remainingNames.length})
              </h2>
              <div className="h-64 overflow-y-auto pr-2">
                {remainingNames.length > 0 ? (
                  <ul className="space-y-2">
                    {remainingNames.map((name, index) => (
                      <li key={index} className="bg-slate-700/50 p-2 rounded-md text-slate-300 truncate">
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic mt-4 text-center">No names left in the bag.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column: Winner Display and Controls */}
          <div className="flex flex-col gap-8">
            <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700 flex-grow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                  <TrophyIcon className="w-6 h-6" />
                  Winner
                </h2>
                <div className="h-40 flex items-center justify-center bg-slate-900 rounded-lg p-4 relative overflow-hidden">
                    {isPicking && (
                         <div className="text-4xl font-bold text-center text-purple-400 animate-pulse transition-all duration-100">
                           {animationName}
                         </div>
                    )}
                    {currentWinner && !isPicking && (
                        <div className="text-center">
                            <p className="text-sm text-yellow-400">Congratulations!</p>
                            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 break-all">{currentWinner}</p>
                        </div>
                    )}
                    {!currentWinner && !isPicking && (
                        <p className="text-slate-500 text-xl">Click "Pick a Winner" to start!</p>
                    )}
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePickWinner}
                  disabled={isPicking || remainingNames.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  <TrophyIcon className="w-5 h-5"/>
                  {isPicking ? 'Picking...' : 'Pick a Winner'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isPicking}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RotateCcwIcon className="w-5 h-5"/>
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-indigo-400">
                Picked Names ({pickedNames.length})
              </h2>
              <div className="h-40 overflow-y-auto pr-2">
                {pickedNames.length > 0 ? (
                  <ul className="space-y-2">
                    {pickedNames.map((name, index) => (
                      <li key={index} className="bg-slate-700/50 p-2 rounded-md text-slate-500 line-through truncate">
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic text-center mt-4">No names have been picked yet.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
