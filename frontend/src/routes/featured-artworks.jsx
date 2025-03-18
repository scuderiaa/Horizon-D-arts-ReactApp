import React, { createContext, useState } from 'react';

export const FeaturedArtworksContext = createContext();

export const FeaturedArtworksProvider = ({ children }) => {
  const [featuredArtworks, setFeaturedArtworks] = useState([
    { _id: 'default1', name: "Starry Night", artist: "Vincent Van Gogh", image: "/logo.webp" },
    { _id: 'default2', name: "The Persistence of Memory", artist: "Salvador Dalí", image: "/logo.webp" },
    { _id: 'default3', name: "Mona Lisa", artist: "Leonardo da Vinci", image: "/logo.webp" }
  ]);
  const [likedArtworks, setLikedArtworks] = useState([]);

  const updateFeaturedArtworks = (newArtwork) => {
    // Prevent duplicate additions
    const isAlreadyFeatured = featuredArtworks.some(art => art._id === newArtwork._id);
    const isAlreadyLiked = likedArtworks.some(art => art._id === newArtwork._id);

    if (isAlreadyFeatured || isAlreadyLiked) {
      return;
    }

    // Add to liked artworks
    setLikedArtworks(prev => [...prev, newArtwork]);

    // Update featured artworks
    if (featuredArtworks.length < 3) {
      setFeaturedArtworks(prev => [...prev, newArtwork]);
    } else {
      const updatedFeatured = [...featuredArtworks];
      updatedFeatured.shift(); // Remove first (oldest) artwork
      updatedFeatured.push(newArtwork);
      setFeaturedArtworks(updatedFeatured);
    }
  };

  return (
    <FeaturedArtworksContext.Provider value={{ 
      featuredArtworks, 
      likedArtworks, 
      updateFeaturedArtworks 
    }}>
      {children}
    </FeaturedArtworksContext.Provider>
  );
};
