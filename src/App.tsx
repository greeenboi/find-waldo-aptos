/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Container, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CollectionsIcon from '@mui/icons-material/Collections';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Map } from './components/Map';
import { AptosClient } from 'aptos';
import { NFTAsset } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('map');
  const [nfts, setNfts] = React.useState<NFTAsset[]>([]);
  
  // Initialize Aptos client
  const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');

  const handleNFTCollect = async (nftId: string) => {
    try {
      // Here you would implement the NFT collection logic using Aptos
      console.log('Collecting NFT:', nftId);
    } catch (error) {
      console.error('Error collecting NFT:', error);
    }
  };

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
      
      <BottomNavigation
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
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
