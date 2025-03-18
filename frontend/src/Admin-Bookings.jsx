import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState({
    fullName: "",
    email: "",
    exhibitionName: "",
    exhibitionDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Base API URL
  const API_URL = "http://127.0.0.1:3000/api/bookings/";

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get(API_URL);
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBooking = async () => {
    // Validate inputs
    if (
      !currentBooking.fullName ||
      !currentBooking.email ||
      !currentBooking.exhibitionName ||
      !currentBooking.exhibitionDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const bookingData = {
        ...currentBooking,
        bookingDate: new Date(), // Add current date as booking date
      };

      if (isEditing) {
        // Update existing booking
        const response = await axios.put(`${API_URL}${editingId}`, bookingData);

        // Update booking in local state
        setBookings(
          bookings.map((booking) =>
            booking._id === editingId ? response.data.data : booking
          )
        );

        // Reset editing state
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Create new booking
        const response = await axios.post(API_URL, bookingData);
        setBookings([...bookings, response.data.data]);
      }

      // Reset form
      setCurrentBooking({
        fullName: "",
        email: "",
        exhibitionName: "",
        exhibitionDate: "",
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking");
    }
  };

  const editBooking = (booking) => {
    // Format the date for the input field (YYYY-MM-DD)
    const formattedDate = new Date(booking.exhibitionDate)
      .toISOString()
      .split("T")[0];

    setCurrentBooking({
      fullName: booking.fullName,
      email: booking.email,
      exhibitionName: booking.exhibitionName,
      exhibitionDate: formattedDate,
    });
    setIsEditing(true);
    setEditingId(booking._id);
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      // Remove from local state
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isEditing ? "Edit Booking" : "Add Booking"}
          </h2>

          {/* Input Fields */}
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={currentBooking.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={currentBooking.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="exhibitionName"
              value={currentBooking.exhibitionName}
              onChange={handleInputChange}
              placeholder="Exhibition Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              name="exhibitionDate"
              value={currentBooking.exhibitionDate}
              onChange={handleInputChange}
              placeholder="Exhibition Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {/* Action Button */}
            <button
              onClick={addBooking}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              {isEditing ? "Update Booking" : "Add Booking"}
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Bookings List</h2>

          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings available</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{booking.fullName}</p>
                    <p className="text-sm text-gray-600">{booking.email}</p>
                    <p className="text-sm text-gray-600">
                      Exhibition: {booking.exhibitionName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(booking.exhibitionDate)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Booked on: {formatDate(booking.bookingDate)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editBooking(booking)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBooking(booking._id)}
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

export default AdminBookings;
