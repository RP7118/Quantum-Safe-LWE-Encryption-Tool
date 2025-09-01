import React, { useState } from 'react';
import { KeyRound, RefreshCw, Copy, Check } from 'lucide-react';
import { KeyPair } from '../types/crypto';
import { encryptionService } from '../services/encryptionService';

interface KeyGenerationProps {
  keyPair: KeyPair | null;
  onKeyGenerated: (keyPair: KeyPair) => void;
}

const KeyGeneration: React.FC<KeyGenerationProps> = ({ keyPair, onKeyGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateKeys = async () => {
    setIsGenerating(true);
    // Simulate key generation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newKeyPair = encryptionService.generateKeyPair();
    onKeyGenerated(newKeyPair);
    setIsGenerating(false);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(type);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const truncateKey = (key: string, length: number = 32) => {
    return key.length > length ? `${key.substring(0, length)}...` : key;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <KeyRound className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Key Generation
          </h2>
        </div>
        <button
          onClick={generateKeys}
          disabled={isGenerating}
          className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     disabled:from-blue-800 disabled:to-blue-900 text-white px-6 py-3 rounded-xl 
                     transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 
                     shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
        >
          <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
          <span className="font-semibold">{isGenerating ? 'Generating...' : 'Generate Keys'}</span>
        </button>
      </div>

      {keyPair && (
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Public Key</span>
                </h3>
                <button
                  onClick={() => copyToClipboard(keyPair.publicKey, 'public')}
                  className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300 
                           px-3 py-1 rounded-lg hover:bg-slate-700/50"
                >
                  {copiedKey === 'public' ? (
                    <Check className="w-4 h-4 text-green-400 animate-in zoom-in duration-300" />
                  ) : (
                    <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="text-sm font-medium">Copy</span>
                </button>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-600/30 font-mono text-sm text-slate-300 break-all 
                            hover:border-slate-500/50 transition-colors duration-300 backdrop-blur-sm">
                {truncateKey(keyPair.publicKey)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Private Key</span>
                </h3>
                <button
                  onClick={() => copyToClipboard(keyPair.privateKey, 'private')}
                  className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300 
                           px-3 py-1 rounded-lg hover:bg-slate-700/50"
                >
                  {copiedKey === 'private' ? (
                    <Check className="w-4 h-4 text-green-400 animate-in zoom-in duration-300" />
                  ) : (
                    <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="text-sm font-medium">Copy</span>
                </button>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-600/30 font-mono text-sm text-slate-300 break-all 
                            hover:border-slate-500/50 transition-colors duration-300 backdrop-blur-sm">
                {truncateKey(keyPair.privateKey)}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Cryptographic Parameters</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <span className="text-slate-400">Dimension:</span>
                <div className="text-white font-mono text-lg font-bold">{keyPair.parameters.dimension}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <span className="text-slate-400">Modulus:</span>
                <div className="text-white font-mono text-lg font-bold">{keyPair.parameters.modulus}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <span className="text-slate-400">Error Bound:</span>
                <div className="text-white font-mono text-lg font-bold">{keyPair.parameters.errorBound}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <span className="text-slate-400">Key Size:</span>
                <div className="text-white font-mono text-lg font-bold">{keyPair.parameters.keySize} bits</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!keyPair && !isGenerating && (
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-slate-600/20 rounded-full blur-xl animate-pulse"></div>
            <KeyRound className="relative w-16 h-16 text-slate-600 mx-auto" />
          </div>
          <p className="text-slate-400 text-lg">Generate a key pair to begin encryption</p>
          <p className="text-slate-500 text-sm mt-2">Click the button above to create your cryptographic keys</p>
        </div>
      )}
    </div>
  );
};

export default KeyGeneration;