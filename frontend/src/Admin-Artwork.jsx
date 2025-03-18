import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios

const ArtworkManager = () => {
  const [artworks, setArtworks] = useState([]);
  const [currentArtwork, setCurrentArtwork] = useState({
    image: null,
    name: "",
    artist: "",
    price: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Base API URL
  const API_URL = "http://127.0.0.1:3000/api/products/";

  // Fetch artworks on component mount
  useEffect(() => {
    fetchArtworks();
  }, []);

  // Fetch artworks from the backend
  const fetchArtworks = async () => {
    try {
      const response = await axios.get(API_URL);
      setArtworks(response.data.data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      alert("Failed to fetch artworks");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentArtwork((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64 for sending to backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentArtwork((prev) => ({
          ...prev,
          image: reader.result, // base64 encoded image
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addArtwork = async () => {
    // Validate inputs
    if (
      !currentArtwork.name ||
      !currentArtwork.artist ||
      !currentArtwork.price
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (isEditing) {
        // Update existing artwork
        const response = await axios.put(
          `${API_URL}${editingId}`,
          currentArtwork
        );

        // Update artwork in local state
        setArtworks(
          artworks.map((artwork) =>
            artwork._id === editingId ? response.data.data : artwork
          )
        );

        // Reset editing state
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Create new artwork
        const response = await axios.post(API_URL, currentArtwork);
        setArtworks([...artworks, response.data.data]);
      }

      // Reset form
      setCurrentArtwork({
        image: null,
        name: "",
        artist: "",
        price: "",
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Error saving artwork:", error);
      alert("Failed to save artwork");
    }
  };

  const editArtwork = (artwork) => {
    // Prepare artwork for editing
    setCurrentArtwork({
      name: artwork.name,
      artist: artwork.artist,
      price: artwork.price,
      image: artwork.image,
    });
    setPreviewImage(artwork.image);
    setIsEditing(true);
    setEditingId(artwork._id);
  };

  const deleteArtwork = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);

      // Remove from local state
      setArtworks(artworks.filter((artwork) => artwork._id !== id));
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("Failed to delete artwork");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        {/* Artwork Form */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isEditing ? "Edit Artwork" : "Add Artwork"}
          </h2>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="artwork-image"
              className="block text-gray-700 font-semibold mb-2"
            >
              Artwork Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="artwork-image"
              />
              <label
                htmlFor="artwork-image"
                className="cursor-pointer w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center hover:border-blue-500 transition"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">Select Image</span>
                )}
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={currentArtwork.name}
              onChange={handleInputChange}
              placeholder="Artwork Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="artist"
              value={currentArtwork.artist}
              onChange={handleInputChange}
              placeholder="Artist Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="price"
              value={currentArtwork.price}
              onChange={handleInputChange}
              placeholder="Price"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={addArtwork}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                {isEditing ? "Update Artwork" : "Add Artwork"}
              </button>
            </div>
          </div>
        </div>

        {/* Artwork List */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Artwork List</h2>

          {artworks.length === 0 ? (
            <p className="text-center text-gray-500">No artworks added</p>
          ) : (
            <div className="space-y-4">
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {artwork.image && (
                      <img
                        src={artwork.image}
                        alt={artwork.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{artwork.name}</p>
                      <p className="text-sm text-gray-600">{artwork.artist}</p>
                      <p className="text-sm text-gray-600">${artwork.price}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editArtwork(artwork)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteArtwork(artwork._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkManager;
