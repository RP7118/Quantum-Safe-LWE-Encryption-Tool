import React from 'react';
import { BookOpen, Lock, Shield, Cpu } from 'lucide-react';

interface InfoPanelProps {
  isVisible: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-750 to-slate-800 border-b border-slate-700/50 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-900/70">
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
              <BookOpen className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Learning with Errors</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                LWE is a computational problem that forms the foundation of quantum-resistant encryption schemes.
              </p>
            </div>
          </div>
          
          <div className="group flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 hover:bg-slate-900/70">
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
              <Shield className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Quantum Resistant</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Lattice-based cryptography is believed to be secure against quantum computer attacks.
              </p>
            </div>
          </div>
          
          <div className="group flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:bg-slate-900/70">
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
              <Lock className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Ring-LWE</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ring-LWE provides improved efficiency by operating over polynomial rings.
              </p>
            </div>
          </div>
          
          <div className="group flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 hover:bg-slate-900/70">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
              <Cpu className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Post-Quantum</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Part of NIST's standardized post-quantum cryptographic algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;