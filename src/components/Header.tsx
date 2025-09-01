import React from 'react';
import { Shield, Info, Zap } from 'lucide-react';

interface HeaderProps {
  showInfo: boolean;
  onToggleInfo: () => void;
}

const Header: React.FC<HeaderProps> = ({ showInfo, onToggleInfo }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg animate-pulse"></div>
              <Shield className="relative w-10 h-10 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  LatticeGuard
                </h1>
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-slate-400 text-sm font-medium tracking-wide">
                Quantum-Resistant Encryption Platform
              </p>
            </div>
          </div>
          <button
            onClick={onToggleInfo}
            className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              showInfo 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/50'
            }`}
          >
            <Info className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">About LWE</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;