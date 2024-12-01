
export interface NFTAsset {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  collected: boolean;
}

export interface UserProfile {
  walletAddress: string;
  collectedNFTs: string[];
  score: number;
}