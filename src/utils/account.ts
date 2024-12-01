import { AptosClient, AptosAccount, HexString } from 'aptos';

export const getAptosClient = () => {
  return new AptosClient('https://fullnode.devnet.aptoslabs.com');
};

export const initializeAccount = (): AptosAccount => {
  const privateKeyHex = import.meta.env.VITE_APTOS_PRIVATE_KEY;
  
  if (!privateKeyHex) {
    throw new Error('VITE_APTOS_PRIVATE_KEY is not set in environment variables');
  }

  // Create account from private key
  return new AptosAccount(HexString.ensure(privateKeyHex).toUint8Array());
};