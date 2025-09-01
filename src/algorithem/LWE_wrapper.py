# LWE_Wrapper_FO_AD_fixed.py
import numpy as np
import random, os, hashlib, base64
from typing import Tuple, List


class LWEEncryption:
    def __init__(self, n: int = 128, q: int = 2053, sigma: float = 3.2):
        self.n = n
        self.q = q
        self.sigma = sigma
        self.m = n + 50
        self.private_key = None
        self.public_key = None

    def _discrete_gaussian(self, sigma: float) -> int:
        u1, u2 = random.uniform(0, 1), random.uniform(0, 1)
        z = np.sqrt(-2 * np.log(u1)) * np.cos(2 * np.pi * u2)
        return int(round(z * sigma)) % self.q

    def generate_keys(self):
        s = np.random.randint(0, 2, self.n, dtype=np.int32)
        A = np.random.randint(0, self.q, (self.m, self.n), dtype=np.int32)
        e = np.array([self._discrete_gaussian(self.sigma) for _ in range(self.m)], dtype=np.int32)
        b = (np.dot(A, s) + e) % self.q
        self.private_key = s
        self.public_key = (A, b)
        return s, (A, b)  # (sk, pk)

    def _string_to_bits(self, text: str) -> List[int]:
        bits = []
        for ch in text:
            bits.extend([int(b) for b in format(ord(ch), '08b')])
        return bits

    def _bits_to_string(self, bits: List[int]) -> str:
        while len(bits) % 8 != 0:
            bits.append(0)
        chars = []
        for i in range(0, len(bits), 8):
            byte = bits[i:i+8]
            val = 0
            for j, bit in enumerate(byte):
                val += bit * (2 ** (7 - j))
            if val > 0:  # your original behavior: drop NULs
                chars.append(chr(val))
        return ''.join(chars)

    def encrypt(self, plaintext: str):
        if self.public_key is None:
            raise ValueError("Keys not generated. Call generate_keys() first.")
        A, b = self.public_key
        bits = self._string_to_bits(plaintext)
        ct = []
        for bit in bits:
            subset_size = random.randint(self.n // 2, self.n)
            S = random.sample(range(self.m), subset_size)
            u = np.zeros(self.n, dtype=np.int32)
            v = 0
            for i in S:
                u = (u + A[i]) % self.q
                v = (v + b[i]) % self.q
            v = (v + bit * (self.q // 2)) % self.q
            ct.append((u, v))
        return ct  # list[(np.array,int)]

    def decrypt(self, ciphertext):
        if self.private_key is None:
            raise ValueError("Private key not available.")
        s = self.private_key
        bits = []
        for u, v in ciphertext:
            inner = np.dot(u, s) % self.q
            diff = (v - inner) % self.q
            bit = 0 if diff < self.q // 4 or diff > 3 * self.q // 4 else 1
            bits.append(bit)
        return self._bits_to_string(bits)

def H(*parts: bytes, outlen: int = 32) -> bytes:
    """Length-prefixed SHAKE-256 over parts."""
    sh = hashlib.shake_256()
    for p in parts:
        if isinstance(p, str):
            p = p.encode()
        sh.update(len(p).to_bytes(4, "big") + p)  # <-- 4 bytes instead of 2
    return sh.digest(outlen)


def serialize_pk(pk: Tuple[np.ndarray, np.ndarray], n: int, q: int, m: int) -> bytes:
    A, b = pk
    return (b"PK" +
            n.to_bytes(2,"big") + q.to_bytes(4,"big") + m.to_bytes(2,"big") +
            A.astype(np.int32).tobytes() + b.astype(np.int32).tobytes())

def serialize_ct(ct) -> bytes:
    """
    Deterministic binary serialization of ciphertext: list of (u,v)
    u: int32 vector -> bytes, v: int (store 8 bytes)
    """
    out = bytearray(b"CT")
    out += len(ct).to_bytes(4, "big")
    for (u, v) in ct:
        u_bytes = u.astype(np.int32).tobytes()
        out += len(u_bytes).to_bytes(4, "big") + u_bytes
        out += int(v).to_bytes(8, "big", signed=False)
    return bytes(out)

def ct_equal(a, b) -> bool:
    return serialize_ct(a) == serialize_ct(b)

class LWEAdapter:
    def __init__(self, lwe: LWEEncryption):
        self.lwe = lwe

    def keygen(self):
        # Your API returns (sk, pk). We must return (pk, sk) in this adapter.
        sk, pk = self.lwe.generate_keys()
        return pk, sk

    def encrypt_det(self, pk, msg32: bytes, coins32: bytes):
        # Force determinism: seed both Python 'random' and NumPy RNG from coins32
        seed_int = int.from_bytes(H(b"rng-seed", coins32), "big") & 0xFFFFFFFF
        random.seed(seed_int)
        np.random.seed(seed_int)
        # Map 32-byte seed -> printable ASCII so your text-based PKE can carry it losslessly.
        msg_b64 = base64.b64encode(msg32).decode("ascii")
        # Use the already-set public key inside lwe; just encrypt the text.
        return self.lwe.encrypt(msg_b64)

    def decrypt(self, sk, ct):
        # Your decrypt returns a string; we base64-decode back to 32 bytes.
        msg_b64 = self.lwe.decrypt(ct)
        try:
            msg = base64.b64decode(msg_b64.encode("ascii"), validate=True)
        except Exception:
            # If decoding fails (e.g., bit errors), return 32 zero bytes to trigger rejection path.
            msg = b"\x00"*32
        # Ensure 32 bytes
        return msg.ljust(32, b"\x00")[:32]


class KEMSecret:
    def __init__(self, pk, sk, pk_hash, z):
        self.pk, self.sk, self.pk_hash, self.z = pk, sk, pk_hash, z

class LWE_KEM_AD:
    def __init__(self, adapter: LWEAdapter, n: int, q: int, m: int):
        self.adapter = adapter
        self.n, self.q, self.m = n, q, m

    def keygen(self) -> KEMSecret:
        pk, sk = self.adapter.keygen()
        pk_ser = serialize_pk(pk, self.n, self.q, self.m)
        pk_hash = H(b"pk", pk_ser)
        z = os.urandom(32)
        return KEMSecret(pk, sk, pk_hash, z)

    def encaps(self, pk_or_bundle, ad: bytes = b""):
        pk = pk_or_bundle.pk if isinstance(pk_or_bundle, KEMSecret) else pk_or_bundle
        pk_ser = serialize_pk(pk, self.n, self.q, self.m)
        pk_hash = H(b"pk", pk_ser)
        m = os.urandom(32)                     # random seed
        mbar = H(b"mbar", m, pk_hash, ad)      # hashed seed
        coins = H(b"coins", mbar, pk_hash, ad) # coins for deterministic encrypt
        ct = self.adapter.encrypt_det(pk, mbar, coins)
        k = H(b"kdf", mbar, H(b"ct", serialize_ct(ct)), pk_hash, ad)
        return ct, k

    def decaps(self, sk_bundle: KEMSecret, ct, ad: bytes = b""):
        pk, sk, pk_hash, z = sk_bundle.pk, sk_bundle.sk, sk_bundle.pk_hash, sk_bundle.z
        mbar = self.adapter.decrypt(sk, ct)
        coins = H(b"coins", mbar, pk_hash, ad)
        ct2 = self.adapter.encrypt_det(pk, mbar, coins)
        if ct_equal(ct2, ct):  # valid ciphertext
            return H(b"kdf", mbar, H(b"ct", serialize_ct(ct)), pk_hash, ad)
        else:                  # implicit rejection
            return H(b"kdf-reject", z, H(b"ct", serialize_ct(ct)), pk_hash, ad)


def xor_encrypt_decrypt(msg: bytes, key: bytes) -> bytes:
    return bytes([m ^ key[i % len(key)] for i, m in enumerate(msg)])

if __name__ == "__main__":
    lwe = LWEEncryption(n=64, q=2053, sigma=3.2)
    adapter = LWEAdapter(lwe)
    kem = LWE_KEM_AD(adapter, n=lwe.n, q=lwe.q, m=lwe.m)

    sk_bundle = kem.keygen()

    ad = b"session-1"
    ct, k_sender = kem.encaps(sk_bundle, ad)
    print("Sender key  :", k_sender.hex())

    k_receiver = kem.decaps(sk_bundle, ct, ad)

    print("Receiver key:", k_receiver.hex())
    print("Keys match? ", "YES" if k_sender == k_receiver else "NO")

    msg = b"HELLO WORLD"
    enc_msg = xor_encrypt_decrypt(msg, k_sender)
    dec_msg = xor_encrypt_decrypt(enc_msg, k_receiver)

    print("Original:", msg)
    print("Encrypted:", enc_msg)
    print("Decrypted:", dec_msg)
