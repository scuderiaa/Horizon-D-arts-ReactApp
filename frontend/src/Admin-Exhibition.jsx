import React, { useState, useEffect } from "react";
import axios from "axios";

const ExhibitionManager = () => {
  const [exhibitions, setExhibitions] = useState([]);
 const [currentExhibition, setCurrentExhibition] = useState({
   image: null,
   name: "",
   lieu: "",
   date: "",
   hours: "",
   price: 0, // Add default price
 });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Base API URL
  const API_URL = "http://127.0.0.1:3000/api/exhibitions/";

  // Fetch exhibitions on component mount
  useEffect(() => {
    fetchExhibitions();
  }, []);

  // Fetch exhibitions from the backend
  const fetchExhibitions = async () => {
    try {
      const response = await axios.get(API_URL);
      setExhibitions(response.data.data);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      alert("Failed to fetch exhibitions");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExhibition((prev) => ({
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
        setCurrentExhibition((prev) => ({
          ...prev,
          image: reader.result, // base64 encoded image
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExhibition = async () => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse selected date
    const selectedDate = new Date(currentExhibition.date);

    // Validate inputs
    if (
      !currentExhibition.name ||
      !currentExhibition.lieu ||
      !currentExhibition.date ||
      !currentExhibition.hours ||
      !currentExhibition.price
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Check if date is valid (not in the past)
    if (selectedDate < today) {
      alert("Please select a future date");
      return;
    }

    try {
      // Detailed date transformation
      const formattedDate = (() => {
        const date = new Date(currentExhibition.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })();

      // Prepare exhibition data with formatted date
      const formattedExhibition = {
        ...currentExhibition,
        date: currentExhibition.date,
      };

      console.log("Formatted Exhibition:", formattedExhibition);
      if (isEditing) {
        // Update existing exhibition
        const response = await axios.put(
          `${API_URL}${editingId}`,
          formattedExhibition
        );

        // Update exhibition in local state
        setExhibitions(
          exhibitions.map((exhibition) =>
            exhibition._id === editingId ? response.data.data : exhibition
          )
        );

        // Reset editing state
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Create new exhibition
        const response = await axios.post(API_URL, formattedExhibition);
        setExhibitions([...exhibitions, response.data.data]);
      }

      // Reset form
      setCurrentExhibition({
        image: null,
        name: "",
        lieu: "",
        date: "",
        hours: "",
        price:0
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Error saving exhibition:", error);
      alert("Failed to save exhibition");
    }
  };

 const editExhibition = (exhibition) => {
   // Format the date for the input field (YYYY-MM-DD)
   const formattedDate = new Date(exhibition.date).toISOString().split("T")[0];

   setCurrentExhibition({
     name: exhibition.name,
     lieu: exhibition.lieu,
     date: formattedDate, // Use the formatted date
     hours: exhibition.hours,
     image: exhibition.image,
     price: exhibition.price,
   });
   setPreviewImage(exhibition.image);
   setIsEditing(true);
   setEditingId(exhibition._id);
 };

  const deleteExhibition = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);

      // Remove from local state
      setExhibitions(exhibitions.filter((exhibition) => exhibition._id !== id));
    } catch (error) {
      console.error("Error deleting exhibition:", error);
      alert("Failed to delete exhibition");
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        {/* Exhibition Form */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isEditing ? "Edit Exhibition" : "Add Exhibition"}
          </h2>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="exhibition-image"
              className="block text-gray-700 font-semibold mb-2"
            >
              Exhibition Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="exhibition-image"
              />
              <label
                htmlFor="exhibition-image"
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
              value={currentExhibition.name}
              onChange={handleInputChange}
              placeholder="Exhibition Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="lieu"
              value={currentExhibition.lieu}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              name="date"
              value={currentExhibition.date}
              onChange={handleInputChange}
              min={getTodayDate()}
              placeholder="Exhibition Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="time"
              name="hours"
              value={currentExhibition.hours}
              onChange={handleInputChange}
              placeholder="Exhibition Hours"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="price"
              value={currentExhibition.price}
              onChange={handleInputChange}
              placeholder="Price (in BIF)"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={addExhibition}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                {isEditing ? "Update Exhibition" : "Add Exhibition"}
              </button>
            </div>
          </div>
        </div>

        {/* Exhibition List */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Exhibition List
          </h2>

          {exhibitions.length === 0 ? (
            <p className="text-center text-gray-500">No exhibitions added</p>
          ) : (
            <div className="space-y-4">
              {exhibitions.map((exhibition) => (
                <div
                  key={exhibition._id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {exhibition.image && (
                      <img
                        src={exhibition.image}
                        alt={exhibition.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{exhibition.name}</p>
                      <p className="text-sm text-gray-600">{exhibition.lieu}</p>
                      <p className="text-sm text-gray-600">
                        {exhibition.date} at {exhibition.hours}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editExhibition(exhibition)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExhibition(exhibition._id)}
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

export default ExhibitionManager;
