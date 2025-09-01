import React, { useState } from 'react';
import { Unlock, AlertCircle } from 'lucide-react';
import { KeyPair } from '../types/crypto';
import { encryptionService } from '../services/encryptionService';

interface DecryptionPanelProps {
  keyPair: KeyPair | null;
}

const DecryptionPanel: React.FC<DecryptionPanelProps> = ({ keyPair }) => {
  const [ciphertext, setCiphertext] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');

  const handleDecrypt = async () => {
    if (!keyPair) {
      setError('Please generate a key pair first');
      return;
    }

    setError('');
    setIsDecrypting(true);
    
    // Simulate decryption delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = encryptionService.decrypt(ciphertext, keyPair.privateKey);
    
    if (result.success) {
      setPlaintext(result.plaintext);
    } else {
      setError(result.error || 'Decryption failed');
      setPlaintext('');
    }
    
    setIsDecrypting(false);
  };

  const clearAll = () => {
    setCiphertext('');
    setPlaintext('');
    setError('');
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Unlock className="w-6 h-6 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Decryption
          </h2>
        </div>
        {(ciphertext || plaintext) && (
          <button
            onClick={clearAll}
            className="text-slate-400 hover:text-white transition-all duration-300 text-sm px-3 py-1 rounded-lg hover:bg-slate-700/50"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="ciphertext" className="block text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>
            Ciphertext to Decrypt
            </span>
          </label>
          <textarea
            id="ciphertext"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Paste encrypted ciphertext here..."
            className="w-full h-36 bg-slate-950/80 border border-slate-600/50 rounded-xl px-4 py-3 
                       text-white placeholder-slate-400 focus:border-orange-400/50 focus:outline-none
                       focus:ring-2 focus:ring-orange-400/20 resize-none font-mono text-sm transition-all duration-300
                       backdrop-blur-sm hover:border-slate-500/50"
          />
        </div>

        <button
          onClick={handleDecrypt}
          disabled={!ciphertext.trim() || isDecrypting || !keyPair}
          className="group w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 
                     disabled:from-slate-700 disabled:to-slate-800 text-white py-4 rounded-xl 
                     transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-[1.02]
                     flex items-center justify-center space-x-3 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
        >
          <Unlock className={`w-5 h-5 ${isDecrypting ? 'animate-pulse' : 'group-hover:-rotate-12'} transition-transform duration-300`} />
          <span className="font-semibold text-lg">{isDecrypting ? 'Decrypting...' : 'Decrypt Message'}</span>
        </button>

        {error && (
          <div className="flex items-center space-x-3 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {plaintext && (
          <div className="animate-in fade-in duration-500">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>
              Decrypted Message
              </span>
            </label>
            <div className="bg-slate-950/80 border border-slate-600/30 rounded-xl p-4 min-h-[120px]
                           text-white whitespace-pre-wrap backdrop-blur-sm hover:border-slate-500/50 
                           transition-colors duration-300 text-lg leading-relaxed">
              {plaintext}
            </div>
          </div>
        )}

        {!keyPair && (
          <div className="bg-slate-950/30 border border-slate-600/30 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-slate-600/20 rounded-full blur-lg animate-pulse"></div>
              <Unlock className="relative w-10 h-10 text-slate-600 mx-auto" />
            </div>
            <p className="text-slate-400 font-medium">Generate a key pair to enable decryption</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecryptionPanel;