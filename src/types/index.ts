
export interface NFTAsset {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  rarity: string;
  imageUrl: string;
  collectedTs?: number; // Optional timestamp for when NFT was collected
}
export interface UserProfile {
  walletAddress: string;
  collectedNFTs: string[];
  score: number;
}