import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import { LatLng, LatLngBounds } from 'leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import type { NFTAsset } from '../types';

interface MapProps {
  nfts: NFTAsset[];
  onNFTCollect: (nftId: string) => void;
}

export const Map: React.FC<MapProps> = ({ nfts, onNFTCollect }) => {
  const { location } = useGeolocation();

  if (!location) {
    return <div>Loading location...</div>;
  }
  const corner1 = new LatLng(location.lat - 0.05, location.lng - 0.05);
  const corner2 = new LatLng(location.lat + 0.05, location.lng + 0.05);
  const bounds = new LatLngBounds(corner1, corner2);

  
  return (
    <MapContainer bounds={bounds}>
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