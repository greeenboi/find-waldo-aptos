/* eslint-disable @typescript-eslint/no-explicit-any */
import { AptosClient, AptosAccount, Types } from 'aptos';
import { NFTAsset } from '../types';

const generateRandomCoordinate = (center: number, offset: number): number => {
  return center + (Math.random() - 0.5) * offset;
};

export const generateWaldoLocations = (
  centerLat: number,
  centerLng: number,
  count: number
): { lat: number; lng: number }[] => {
  return Array.from({ length: count }, () => ({
    lat: generateRandomCoordinate(centerLat, 0.1),
    lng: generateRandomCoordinate(centerLng, 0.1),
  }));
};
let isMinting = false;
export const mintWaldoNFT = async (
  client: AptosClient,
  account: AptosAccount,
  location: { lat: number; lng: number }
): Promise<NFTAsset> => {
  if (isMinting) {
    throw new Error('Minting is already in progress. Please wait.');
  }
  isMinting = true;
  
  try {
    const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS;

    if (!moduleAddress) {
      throw new Error('Module address not found in environment variables');
    }

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::waldo_nft::mint_waldo`,
      type_arguments: [],
      arguments: [
        location.lat.toString(),
        location.lng.toString()
      ]
    };

    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const response = await client.submitTransaction(signedTxn);

    await client.waitForTransaction(response.hash);

    return {
      id: response.hash,
      name: 'Waldo',
      location,
      rarity: 'common',
      imageUrl: `https://api.example.com/waldo?lat=${location.lat}&lng=${location.lng}`,
      collectedTs: undefined
    };
  } catch (error: any) {
    if (error.message.includes('Transaction already in mempool')) {
      throw new Error('A transaction is already pending. Please wait for it to complete before minting again.');
    }
    console.error('Error minting Waldo NFT:', error);
    throw error;
  } finally {
    isMinting = false;
  }
};

export const fetchExistingWaldos = async (
  client: AptosClient,
  collectionAddress: string
): Promise<NFTAsset[]> => {
  try {
    const resources = await client.getAccountResources(collectionAddress);
    const nftResource = resources.find(r => r.type.includes('::nft::'));
    
    if (!nftResource?.data) {
      return [];
    }

    // Parse the NFT data from the resource
    // This is a simplified example - adjust according to your actual contract structure
    const nftData = nftResource.data as Record<string, any>;
    const tokens = nftData.tokens || [];

    return tokens.map((token: any) => ({
      id: token.id,
      name: token.name || 'Waldo',
      location: JSON.parse(token.properties),
      rarity: token.rarity || 'common',
      imageUrl: token.uri,
      collectedTs: token.collected_at
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};

export const collectNFT = async (
  client: AptosClient,
  account: AptosAccount,
  nftId: string
): Promise<boolean> => {
  const moduleAddress = import.meta.env.VITE_APTOS_MODULE_ADDRESS;
  
  if (!moduleAddress) {
    throw new Error('Module address not found in environment variables');
  }

  const payload: Types.TransactionPayload = {
    type: "entry_function_payload",
    function: `${moduleAddress}::nft::collect`,
    type_arguments: [],
    arguments: [nftId]
  };

  try {
    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const response = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(response.hash);
    return true;
  } catch (error) {
    console.error('Error collecting NFT:', error);
    return false;
  }
};