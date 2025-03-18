  import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { FeaturedArtworksContext } from "./featured-artworks";
import LoadingSpinner from "../components/LoadingSpinner";
export function AboutUs() {
  const [artworks, setArtworks] = useState([]);
  const [likedArtworks, setLikedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateFeaturedArtworks } = useContext(FeaturedArtworksContext);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/products/");
        setArtworks(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch artworks");
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleLikeArtwork = (artwork) => {
    updateFeaturedArtworks(artwork);

    // Toggle liked state for the specific artwork
    setLikedArtworks((prevLikedArtworks) => {
      const isAlreadyLiked = prevLikedArtworks.some(
        (liked) => liked._id === artwork._id
      );

      if (isAlreadyLiked) {
        // Remove from liked artworks if already liked
        return prevLikedArtworks.filter((liked) => liked._id !== artwork._id);
      } else {
        // Add to liked artworks
        return [...prevLikedArtworks, artwork];
      }
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading Gallery..." />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-16">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <section>
        <h2 className="text-3xl font-bold mb-8 text-orange-600 text-center">
          Our Gallery Artists Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => {
            const isLiked = likedArtworks.some(
              (liked) => liked._id === artwork._id
            );

            return (
              <div
                key={artwork._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-orange-100"
              >
                <div className="relative">
                  <img
                    src={artwork.image}
                    alt={artwork.name}
                    className="w-full h-64 object-cover"
                  />
                  <div
                    onClick={() => handleLikeArtwork(artwork)}
                    className="absolute top-4 right-4 bg-white/70 rounded-full p-2 cursor-pointer"
                  >
                    <Heart
                      size={24}
                      className={`
                        ${
                          isLiked
                            ? "text-orange-500 fill-orange-500"
                            : "text-orange-500 hover:fill-orange-500"
                        }
                      `}
                    />
                  </div>
                </div>
                <div className="p-6 bg-orange-50">
                  <h3 className="text-xl font-bold mb-2 text-orange-800">
                    {artwork.artist}
                  </h3>
                  <p className="text-orange-600 mb-4 italic">{artwork.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-orange-700">
                      ${artwork.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {artworks.length === 0 && (
          <div className="text-center text-orange-500 py-16 text-2xl">
            No artworks available at the moment
          </div>
        )}
      </section>
    </div>
  );
}

export default AboutUs;
