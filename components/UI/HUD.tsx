
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, MessageSquare, Eye, Share2, Video, Radio, Hammer, Code } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, GEMINI_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'DOUBLE JUMP',
        description: 'Jump again in mid-air. Reach higher goals.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'RESILIENCE UP',
        description: 'Permanently adds a heart slot. Stay in the game longer.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'DEBUG KIT',
        description: 'Restores 1 Life point instantly.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'FLOW STATE',
        description: 'Unlock Ability: Press Space/Tap to be invincible for 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

// --- Chat Component (Community Feed) ---
const CHAT_MESSAGES = [
    "Shipping meaningful code!",
    "This feature is fire 🔥",
    "Scalability looks good",
    "Building the future",
    "Value add +++",
    "Great velocity today",
    "Creating > Consuming",
    "Pioneering new tech",
    "Deploying to prod...",
    "Solid foundation",
    "Community is loving this",
    "Impact is rising",
    "Aesthetics on point",
    "Optimized for success",
    "Just shipped it!"
];

const ChatFeed: React.FC = () => {
    const [messages, setMessages] = useState<{id: number, user: string, text: string, color: string}[]>([]);
    const nextId = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.4) return; // Randomize pacing
            
            const text = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
            const user = `Builder_${Math.floor(Math.random() * 999)}`;
            const color = GEMINI_COLORS[Math.floor(Math.random() * GEMINI_COLORS.length)];
            
            setMessages(prev => {
                const next = [...prev, { id: nextId.current++, user, text, color }];
                if (next.length > 6) return next.slice(1);
                return next;
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-16 left-4 w-72 h-48 overflow-hidden hidden md:flex flex-col justify-end pointer-events-none mask-image-linear-gradient">
            <div className="space-y-2">
                {messages.map(msg => (
                    <div key={msg.id} className="animate-in slide-in-from-left-10 fade-in duration-300">
                        <span className="font-bold text-xs mr-2 shadow-black drop-shadow-md" style={{color: msg.color}}>{msg.user}:</span>
                        <span className="text-white text-sm shadow-black drop-shadow-md font-mono">{msg.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        // Select 3 random items, filtering out one-time items already bought
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        // Shuffle and pick 3
        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, []);

    return (
        <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
             <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                 <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 mb-2 font-cyber tracking-widest text-center">RESOURCE HUB</h2>
                 <div className="flex items-center text-yellow-400 mb-6 md:mb-8">
                     <span className="text-base md:text-lg mr-2">AVAILABLE IMPACT:</span>
                     <span className="text-xl md:text-2xl font-bold">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="bg-gray-900/80 border border-gray-700 p-4 md:p-6 rounded-xl flex flex-col items-center text-center hover:border-orange-500 transition-colors">
                                 <div className="bg-gray-800 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                                     <Icon className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
                                 </div>
                                 <h3 className="text-lg md:text-xl font-bold mb-2">{item.name}</h3>
                                 <p className="text-gray-400 text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center">{item.description}</p>
                                 <button 
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded font-bold w-full text-sm md:text-base ${canAfford ? 'bg-gradient-to-r from-orange-600 to-pink-600 hover:brightness-110' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                                 >
                                     {item.cost} IMPACT
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,69,0,0.4)]"
                 >
                     CONTINUE BUILDING <Play className="ml-2 w-5 h-5" fill="white" />
                 </button>
             </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed } = useStore();
  const target = ['P', 'I', 'O', 'N', 'E', 'E', 'R'];

  // Common container style
  const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-[#050011] pointer-events-auto overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050011] to-[#050011]"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              
              {/* Main Card */}
              <div className="relative w-full max-w-2xl flex flex-col items-center justify-center p-8 z-10">
                 
                 {/* Animated Logo Representation */}
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-purple-600 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl rotate-3 flex items-center justify-center shadow-[0_0_50px_rgba(255,69,0,0.4)] animate-in zoom-in duration-1000">
                         <Rocket className="w-20 h-20 text-white drop-shadow-lg" />
                    </div>
                 </div>

                 {/* Title */}
                 <div className="text-center mb-12">
                    <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 mb-2 font-cyber tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                        VIBE CODE
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-[0.3em] font-cyber">
                        PIONEERS
                    </h2>
                 </div>
                 
                 {/* Start Button */}
                 <button 
                    onClick={() => { audio.init(); startGame(); }}
                    className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,165,0,0.4)] overflow-hidden tracking-wider"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 group-hover:text-white transition-colors flex items-center">
                        INITIALIZE BUILD <Rocket className="ml-3 w-6 h-6" />
                    </span>
                 </button>

                 <p className="text-gray-500 text-sm font-mono mt-8 tracking-widest uppercase">
                     System Ready // Awaiting Input
                 </p>
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-sm overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <div className="flex items-center justify-center mb-6 animate-pulse">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <h1 className="text-xl font-mono text-red-500 tracking-widest">OFFLINE</h1>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 font-cyber text-center">LEGACY ARCHIVED</h1>
                <p className="text-gray-400 font-mono mb-8">YOUR BUILD HAS BEEN DEPLOYED</p>
                
                <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-yellow-400 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5"/> STAGE REACHED</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{level}</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-pink-400 text-sm md:text-base"><Diamond className="mr-2 w-4 h-4 md:w-5 md:h-5"/> VALUE CREATED</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{gemsCollected}</div>
                    </div>
                     <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg flex items-center justify-between mt-2">
                        <div className="flex items-center text-white text-sm md:text-base">TOTAL IMPACT</div>
                        <div className="text-2xl md:text-3xl font-bold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{score.toLocaleString()}</div>
                    </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,69,0,0.4)]"
                >
                    START NEW BUILD
                </button>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <Rocket className="w-16 h-16 md:w-24 md:h-24 text-orange-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,140,0,0.6)]" />
                <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 mb-2 drop-shadow-[0_0_20px_rgba(255,0,80,0.4)] font-cyber text-center leading-tight">
                    TRUE PIONEER
                </h1>
                <p className="text-pink-200 text-sm md:text-xl font-mono mb-8 tracking-widest text-center">
                    YOU HAVE BUILT SOMETHING LASTING
                </p>
                
                <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-black/60 p-6 rounded-xl border border-orange-500/30 shadow-[0_0_15px_rgba(255,69,0,0.1)]">
                        <div className="text-xs md:text-sm text-gray-400 mb-1 tracking-wider">FINAL IMPACT</div>
                        <div className="text-3xl md:text-4xl font-bold font-cyber text-orange-400">{score.toLocaleString()}</div>
                    </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] tracking-widest"
                >
                    CONTINUE THE JOURNEY
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={containerClass}>
        {/* Stream Overlay Header */}
        <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center bg-orange-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse text-white shadow-[0_0_10px_rgba(255,69,0,0.5)]">
                        <Hammer className="w-3 h-3 mr-1" /> BUILDING
                    </div>
                    <div className="flex items-center bg-black/50 border border-white/20 px-2 py-0.5 rounded text-xs font-mono text-white">
                         <Activity className="w-3 h-3 mr-1 text-gray-400" /> IMPACT
                    </div>
                </div>
                <div className="text-3xl md:text-5xl font-bold text-white drop-shadow-[0_0_10px_#ff0054] font-cyber tabular-nums">
                    {score.toLocaleString()}
                </div>
            </div>
            
            <div className="flex flex-col items-end">
                <div className="flex space-x-1 md:space-x-2 mb-2">
                    {[...Array(maxLives)].map((_, i) => (
                        <Heart 
                            key={i} 
                            className={`w-6 h-6 md:w-8 md:h-8 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800 fill-gray-800'} drop-shadow-[0_0_5px_#ff0054]`} 
                        />
                    ))}
                </div>
                <div className="flex items-center text-orange-400 font-mono text-sm bg-black/40 px-2 py-1 rounded border border-orange-500/30">
                    <Diamond className="w-4 h-4 mr-1 fill-orange-400/20" /> {gemsCollected} VALUE
                </div>
            </div>
        </div>
        
        {/* Level Indicator */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-sm md:text-lg text-orange-200 font-bold tracking-wider font-mono bg-black/50 px-3 py-1 rounded-full border border-orange-500/30 backdrop-blur-sm z-50">
            STAGE {level} <span className="text-gray-500 text-xs md:text-sm">/ 3</span>
        </div>

        {/* Active Skill Indicator */}
        {isImmortalityActive && (
             <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_gold]">
                 <Shield className="mr-2 fill-yellow-400" /> FLOW STATE
             </div>
        )}

        {/* PIONEER Collection Status */}
        <div className="absolute top-20 md:top-28 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = GEMINI_COLORS[idx];

                return (
                    <div 
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : 'rgba(55, 65, 81, 1)',
                            color: isCollected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(55, 65, 81, 1)',
                            boxShadow: isCollected ? `0 0 15px ${color}` : 'none',
                            backgroundColor: isCollected ? color : 'rgba(0, 0, 0, 0.9)'
                        }}
                        className={`w-7 h-9 md:w-9 md:h-11 flex items-center justify-center border-2 font-black text-base md:text-lg font-cyber rounded-lg transform transition-all duration-300`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        {/* Chat Overlay */}
        <ChatFeed />

        {/* Bottom Overlay */}
        <div className="w-full flex justify-end items-end">
             <div className="flex items-center space-x-2 text-orange-500 opacity-70">
                 <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                 <span className="font-mono text-base md:text-xl">VELOCITY {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
             </div>
        </div>
    </div>
  );
};
