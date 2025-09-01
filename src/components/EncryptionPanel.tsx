import React, { useState } from 'react';
import { Lock, Copy, Check, AlertCircle } from 'lucide-react';
import { KeyPair } from '../types/crypto';
import { encryptionService } from '../services/encryptionService';

interface EncryptionPanelProps {
  keyPair: KeyPair | null;
}

const EncryptionPanel: React.FC<EncryptionPanelProps> = ({ keyPair }) => {
  const [message, setMessage] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!keyPair) {
      setError('Please generate a key pair first');
      return;
    }

    setError('');
    setIsEncrypting(true);
    
    // Simulate encryption delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = encryptionService.encrypt(message, keyPair.publicKey);
    
    if (result.success) {
      setCiphertext(result.ciphertext);
    } else {
      setError(result.error || 'Encryption failed');
    }
    
    setIsEncrypting(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ciphertext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const clearAll = () => {
    setMessage('');
    setCiphertext('');
    setError('');
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Lock className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Encryption
          </h2>
        </div>
        {(message || ciphertext) && (
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
          <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>
            Message to Encrypt
            </span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your secret message here..."
            className="w-full h-36 bg-slate-950/80 border border-slate-600/50 rounded-xl px-4 py-3 
                       text-white placeholder-slate-400 focus:border-green-400/50 focus:outline-none
                       focus:ring-2 focus:ring-green-400/20 resize-none transition-all duration-300
                       backdrop-blur-sm hover:border-slate-500/50"
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={!message.trim() || isEncrypting || !keyPair}
          className="group w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                     disabled:from-slate-700 disabled:to-slate-800 text-white py-4 rounded-xl 
                     transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-[1.02]
                     flex items-center justify-center space-x-3 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
        >
          <Lock className={`w-5 h-5 ${isEncrypting ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform duration-300`} />
          <span className="font-semibold text-lg">{isEncrypting ? 'Encrypting...' : 'Encrypt Message'}</span>
        </button>

        {error && (
          <div className="flex items-center space-x-3 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {ciphertext && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-300 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>
                Encrypted Ciphertext
                </span>
              </label>
              <button
                onClick={copyToClipboard}
                className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300 
                         px-3 py-1 rounded-lg hover:bg-slate-700/50"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400 animate-in zoom-in duration-300" />
                ) : (
                  <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                )}
                <span className="text-sm font-medium">Copy</span>
              </button>
            </div>
            <div className="bg-slate-950/80 border border-slate-600/30 rounded-xl p-4 font-mono text-sm 
                           text-slate-300 break-all max-h-36 overflow-y-auto backdrop-blur-sm
                           hover:border-slate-500/50 transition-colors duration-300">
              {ciphertext}
            </div>
          </div>
        )}

        {!keyPair && (
          <div className="bg-slate-950/30 border border-slate-600/30 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-slate-600/20 rounded-full blur-lg animate-pulse"></div>
              <Lock className="relative w-10 h-10 text-slate-600 mx-auto" />
            </div>
            <p className="text-slate-400 font-medium">Generate a key pair to enable encryption</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptionPanel;