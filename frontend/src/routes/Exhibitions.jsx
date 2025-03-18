import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, TicketIcon, CreditCard } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoadingSpinner from "../components/LoadingSpinner";
const ExhibitionBookingModal = ({ exhibition, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [bookingDetails, setBookingDetails] = useState({
    fullName: "",
    email: "",
    exhibitionId: exhibition._id,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

const handleBooking = async (e) => {
  e.preventDefault();
  setIsProcessing(true);
  setPaymentError(null);

  try {
    if (!stripe || !elements) {
      throw new Error("Stripe hasn't been initialized yet");
    }

    // Calculate price in cents (for Stripe)
    const priceInCents = Math.round(exhibition.price / 20);
    console.log("Price in cents:", priceInCents);

    // 1. Create payment intent first
    try {
      console.log("Creating payment intent with data:", {
        amount: priceInCents,
        exhibitionId: exhibition._id,
        email: bookingDetails.email,
        fullName: bookingDetails.fullName,
      });

      const paymentResponse = await axios.post(
        "http://localhost:3000/api/stripe/create-payment-intent",
        {
          amount: priceInCents,
          exhibitionId: exhibition._id,
          email: bookingDetails.email,
          fullName: bookingDetails.fullName,
        }
      );

      console.log("Payment intent response:", paymentResponse.data);
      const { clientSecret } = paymentResponse.data;

      // 2. Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: bookingDetails.fullName,
              email: bookingDetails.email,
            },
          },
        }
      );

      if (error) {
        console.error("Stripe confirmation error:", error);
        throw error;
      }

      // 3. If payment successful, create booking
      if (paymentIntent.status === "succeeded") {
        const bookingData = {
          fullName: bookingDetails.fullName,
          email: bookingDetails.email,
          exhibitionName: exhibition.name,
          exhibitionDate: new Date(exhibition.date),
          bookingDate: new Date(),
          paymentIntentId: paymentIntent.id,
          amount: priceInCents,
        };

        console.log("Creating booking with data:", bookingData);

        const bookingResponse = await axios.post(
          "http://localhost:3000/api/bookings",
          bookingData
        );

        console.log("Booking created:", bookingResponse.data);
        alert(`Booking for ${exhibition.name} confirmed successfully!`);
        onClose();
      }
    } catch (apiError) {
      console.error("API Error details:", {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
      });
      throw new Error(
        apiError.response?.data?.message ||
          apiError.message ||
          "Failed to process payment"
      );
    }
  } catch (error) {
    console.error("Final error:", error);
    setPaymentError(
      error.message ||
        "An error occurred during payment processing. Please try again."
    );
  } finally {
    setIsProcessing(false);
  }
};

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          Book Exhibition: {exhibition.name}
        </h2>

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={bookingDetails.fullName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={bookingDetails.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Details
            </label>
            <div className="p-2 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          {paymentError && (
            <div className="text-red-500 text-sm">{paymentError}</div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !stripe}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-md disabled:opacity-50"
            >
              {isProcessing
                ? "Processing..."
                : `Pay ${exhibition.price / 2000}€`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/exhibitions/"
      );
      setExhibitions(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      setError("Impossible de charger les expositions");
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Exhibitions..." />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-parkinSans ">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 underline text-center text-amber-700">
            Discover our Exhibitions
          </h2>

          {exhibitions.length === 0 ? (
            <p className="text-center text-amber-700">
              Aucune exposition à venir pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibitions.map((exhibit) => (
                <div
                  key={exhibit._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={exhibit.image}
                      alt={exhibit.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                      {formatDate(exhibit.date)}
                    </div>
                  </div>

                  <div className="p-6 bg-fuchsia-50 ">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      {exhibit.name}
                    </h3>

                    <div className="space-y-3 mb-6 ">
                      <div className="flex items-center space-x-3">
                        <MapPin size={24} className="text-purple-800" />
                        <span className="text-gray-700">{exhibit.lieu}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock size={24} className="text-orange-500" />
                        <span className="text-gray-700">{exhibit.hours}</span>
                      </div>

                      {/* New Price Section */}
                      <div className="flex items-center space-x-3">
                        <CreditCard size={24} className="text-green-600" />
                        <span className="text-gray-700 font-semibold">
                          {exhibit.price
                            ? `${exhibit.price} BIF`
                            : "Free Entry"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedExhibition(exhibit)}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white px-4 py-2 rounded-lg    transition"
                    >
                      <TicketIcon size={20} />
                      <span className="">Book Exhibition</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      {selectedExhibition && (
        <ExhibitionBookingModal
          exhibition={selectedExhibition}
          onClose={() => setSelectedExhibition(null)}
        />
      )}
    </>
  );
};

export default Exhibitions;
