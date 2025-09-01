import React, { useState } from 'react';
import { KeyPair } from './types/crypto';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import KeyGeneration from './components/KeyGeneration';
import EncryptionPanel from './components/EncryptionPanel';
import DecryptionPanel from './components/DecryptionPanel';

function App() {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleKeyGenerated = (newKeyPair: KeyPair) => {
    setKeyPair(newKeyPair);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header showInfo={showInfo} onToggleInfo={toggleInfo} />
      <InfoPanel isVisible={showInfo} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Key Generation Section */}
          <KeyGeneration 
            keyPair={keyPair} 
            onKeyGenerated={handleKeyGenerated} 
          />

          {/* Encryption and Decryption Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            <EncryptionPanel keyPair={keyPair} />
            <DecryptionPanel keyPair={keyPair} />
          </div>

          {/* Footer */}
          <footer className="text-center py-12 border-t border-slate-700/50">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-slate-400 text-base font-medium">
              This demo uses placeholder encryption. Replace the EncryptionService with your LWE implementation.
            </p>
              <p className="text-slate-500 text-sm">
              Built for educational and demonstration purposes
            </p>
              <div className="flex items-center justify-center space-x-2 pt-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;