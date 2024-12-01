
import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import { LatLng, LatLngBounds } from 'leaflet';
import type { NFTAsset } from './types';
import { useGeolocation } from './hooks/useGeolocation';

interface MapProps {
  nfts: NFTAsset[];
  onNFTCollect: (nftId: string) => void;
}

export const Map: React.FC<MapProps> = ({ nfts, onNFTCollect }) => {
  const { location } = useGeolocation();

  if (!location) {
    return <div>Loading location...</div>;
  }

  const calculateBounds = () => {
    const locations = [...nfts.map(nft => [nft.location.lat, nft.location.lng]), [location.lat, location.lng]];
    const lats = locations.map(loc => loc[0]);
    const lngs = locations.map(loc => loc[1]);
    
    const corner1 = new LatLng(Math.min(...lats) - 0.05, Math.min(...lngs) - 0.05);
    const corner2 = new LatLng(Math.max(...lats) + 0.05, Math.max(...lngs) + 0.05);
    return new LatLngBounds(corner1, corner2);
  };

  return (
    <MapContainer bounds={calculateBounds()}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {nfts.map((nft) => (
        <Marker key={nft.id} position={[nft.location.lat, nft.location.lng]}>
          <Popup>
            <h3>{nft.name}</h3>
            <p>Rarity: {nft.rarity}</p>
            <Button onClick={() => onNFTCollect(nft.id)}>Collect</Button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};