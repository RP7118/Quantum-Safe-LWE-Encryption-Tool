export interface LWEParameters {
  dimension: number;
  modulus: number;
  errorBound: number;
  keySize: number;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  parameters: LWEParameters;
  generated: Date;
}

export interface EncryptionResult {
  ciphertext: string;
  success: boolean;
  error?: string;
}

export interface DecryptionResult {
  plaintext: string;
  success: boolean;
  error?: string;
}