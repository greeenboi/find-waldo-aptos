/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Container, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CollectionsIcon from '@mui/icons-material/Collections';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Map } from './components/Map';
import { NFTAsset } from './types';
import { generateWaldoLocations, mintWaldoNFT, fetchExistingWaldos, collectNFT } from './utils/nft-operations';
import { initializeAccount, getAptosClient } from './utils/account';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [nfts, setNfts] = useState<NFTAsset[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async (location: { lat: number; lng: number }) => {
    setIsMinting(true);
    setError(null);
    try {
      const nft = await mintWaldoNFT(client, account!, location);
      setNfts([...nfts, nft]); // Update your NFTs list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsMinting(false);
    }
  };
  
  // Initialize Aptos client and account
  const client = React.useMemo(() => getAptosClient(), []);
  const account = React.useMemo(() => {
    try {
      return initializeAccount();
    } catch (error) {
      console.error('Failed to initialize account:', error);
      return null;
    }
  }, []);

  React.useEffect(() => {
    const initializeWaldos = async () => {
      if (!account) {
        setIsInitializing(false);
        return;
      }

      try {
        const existingWaldos = await fetchExistingWaldos(client, account.address().hex());
        
        if (existingWaldos.length === 0) {
          const locations = generateWaldoLocations(51.5074, -0.1278, 5);
          
          // Mint NFTs for each location - mintWaldoNFT now returns complete NFTAsset objects
          const newNFTs = await Promise.all(
            locations.map(location => mintWaldoNFT(client, account, location))
          );
          
          setNfts(newNFTs);
        } else {
          setNfts(existingWaldos);
        }
      } catch (error) {
        console.error('Error initializing Waldos:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeWaldos();
  }, [account]);

  const handleNFTCollect = async (nftId: string) => {
    if (!account) return;

    try {
      const success = await collectNFT(client, account, nftId);
      
      if (success) {
        // Update the NFT's collected status locally
        setNfts(currentNfts => currentNfts.map(nft => 
          nft.id === nftId 
            ? { ...nft, collectedTs: Date.now() }
            : nft
        ));
      }
    } catch (error) {
      console.error('Error collecting NFT:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!account) {
    return <div>Failed to initialize Aptos account. Check your environment variables.</div>;
  }

  if (isInitializing) {
    return <div>Initializing Waldos...</div>;
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'map' && (
          <Map nfts={nfts} onNFTCollect={handleNFTCollect} />
        )}
        {activeTab === 'collection' && (
          <Box>Collection View</Box>
        )}
        {activeTab === 'leaderboard' && (
          <Box>Leaderboard</Box>
        )}
      </Box>
      <button onClick={() => handleMint({ lat: 40.7128, lng: -74.0060 })} disabled={isMinting}>
        {isMinting ? 'Minting...' : 'Mint Waldo NFT'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {/* Render NFTs */}
      <div>
        {nfts.map((nft) => (
          <div key={nft.id}>
            <h3>{nft.name}</h3>
            <p>Location: {nft.location.lat}, {nft.location.lng}</p>
            <img src={nft.imageUrl} alt={nft.name} />
          </div>
        ))}
      </div>
      
      <BottomNavigation
        value={activeTab}
        onChange={(_event, newValue) => setActiveTab(newValue)}
        sx={{ position: 'sticky', bottom: 0, width: '100%' }}
      >
        <BottomNavigationAction
          label="Map"
          value="map"
          icon={<MapIcon />}
        />
        <BottomNavigationAction
          label="Collection"
          value="collection"
          icon={<CollectionsIcon />}
        />
        <BottomNavigationAction
          label="Leaderboard"
          value="leaderboard"
          icon={<LeaderboardIcon />}
        />
      </BottomNavigation>
    </Container>
  );
};

export default App;
