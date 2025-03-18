import React,{useEffect,useState} from 'react'
import { Link } from 'react-router';
import {
  ArrowRightCircle,
  Calendar,
  MapPin,
  TicketIcon,
  CreditCard,
} from "lucide-react";
import { ReactTyped } from 'react-typed';
import { FeaturedArtworksContext } from "./featured-artworks";
import axios from 'axios';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
function Home() {
  const { featuredArtworks } = React.useContext(FeaturedArtworksContext);
  const [upcomingExhibitions, setUpcomingExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);

  useEffect(() => {
    const fetchUpcomingExhibitions = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3000/api/exhibitions/"
        );
        // Sort exhibitions by date and take the 3 most recent
        const sortedExhibitions = response.data.data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setUpcomingExhibitions(sortedExhibitions);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    };

    fetchUpcomingExhibitions();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleBookExhibition = (exhibition) => {
    setSelectedExhibition(exhibition);
  };

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

       // 1. Create payment intent
       const paymentResponse = await axios.post(
         "http://localhost:3000/api/stripe/create-payment-intent",
         {
           amount: priceInCents,
           exhibitionId: exhibition._id,
           email: bookingDetails.email,
           fullName: bookingDetails.fullName,
         }
       );

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

         const bookingResponse = await axios.post(
           "http://localhost:3000/api/bookings",
           bookingData
         );

         alert(`Booking for ${exhibition.name} confirmed successfully!`);
         onClose();
       }
     } catch (error) {
       console.error("Payment error:", error);
       setPaymentError(
         error.message ||
           "An error occurred during payment processing. Please try again."
       );
     } finally {
       setIsProcessing(false);
     }
   };

   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setBookingDetails((prev) => ({
       ...prev,
       [name]: value,
     }));
   };

   return (
     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center font-parkinSans">
       <div className="bg-white rounded-lg p-6 w-96 max-w-md">
         <h2 className="text-2xl font-bold mb-6 text-center">
           Book {exhibition.name}
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

           <div className="bg-gray-100 p-4 rounded-lg">
             <h3 className="font-semibold mb-2">Exhibition Details</h3>
             <div className="space-y-2">
               <div className="flex items-center space-x-2">
                 <MapPin size={20} className="text-blue-500" />
                 <span>{exhibition.lieu}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <Calendar size={20} className="text-green-500" />
                 <span>{formatDate(exhibition.date)}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <CreditCard size={20} className="text-purple-500" />
                 <span>
                   {exhibition.price ? `${exhibition.price} BIF` : "Free Entry"}
                 </span>
               </div>
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
  return (
    <div className="mt-5 font-parkinSans">
      <section className="mb-16 max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-orange-600 bg-clip-text text-transparent  text-center">
          <ReactTyped
            strings={["Welcome at", "Discover", " Take a look at"]}
            typeSpeed={100}
            backSpeed={120}
            loop
          />
          l'Horizon des Arts
        </h1>
        <p className="text-lg text-orange-700 mb-8 text-center font-parkinSans font-bold">
          Discover our collection of exceptional artwork and explore upcoming
          exhibitions.
        </p>
        <div className="flex space-x-4 justify-center">
          <Link
            to="/exhibitions"
            className="bg-orange-600 hover:bg-gray-800 text-white py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <span className="font-bold font-parkinSans">See Exhibitions</span>
            <ArrowRightCircle size={20} />
          </Link>
          <Link
            to="/about-us"
            className="bg-slate-100 hover:bg-gray-300 text-black py-3 px-6 rounded-lg flex items-center space-x-2"
          >
            <span className="font-bold font-parkinSans">
              Discover Our Collections
            </span>
            <ArrowRightCircle size={20} />
          </Link>
        </div>
      </section>
      <section>
        <section className="py-12 bg-gradient-to-r from-orange-500 to-indigo-500 text-white text-center">
          <h2 className="text-4xl font-bold font-parkinSans ">
            Art Gallery Perspectives
          </h2>
          <p className="mt-4 text-lg font-parkinSans">
            Exploring creative universes and celebrating artistic expressions.
          </p>

          {/* New content sections */}
          <section className="py-12">
            <h2 className="text-3xl font-semibold text-center">
              Featured Artwork
            </h2>
            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3 px-4">
              {featuredArtworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <img
                    src={artwork.image}
                    alt={artwork.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{artwork.name}</h3>
                    <p className="text-gray-600">{artwork.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
        <section className="py-12 bg-gray-100">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Upcoming Exhibitions
          </h2>
          {upcomingExhibitions.length === 0 ? (
            <p className="text-center text-gray-600">
              No upcoming exhibitions at the moment.
            </p>
          ) : (
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              {upcomingExhibitions.map((exhibition) => (
                <div
                  key={exhibition._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={exhibition.image}
                    alt={exhibition.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">
                      {exhibition.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={20} className="mr-2 text-blue-500" />
                      <span>{exhibition.lieu}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar size={20} className="mr-2 text-green-500" />
                      <span>{formatDate(exhibition.date)}</span>
                    </div>
                    <button
                      onClick={() => handleBookExhibition(exhibition)}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center"
                    >
                      <TicketIcon size={20} className="mr-2" />
                      Book Exhibition
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Booking Modal */}
        {selectedExhibition && (
          <ExhibitionBookingModal
            exhibition={selectedExhibition}
            onClose={() => setSelectedExhibition(null)}
          />
        )}

        <section className="py-16 bg-gray-100 ">
          <div className="max-w-4xl mx-auto px-4 ">
            <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
              Experience Art Without Boundaries
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105">
                <MapPin size={48} className="mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Our Location
                </h3>
                <p className="text-gray-600">
                  Avenue du cinquantenaire numero 8, Kigobe Sud
                  <br />
                  Mukaza,Bujumbura Mairie
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105">
                <Calendar size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Gallery Hours
                </h3>
                <p className="text-gray-600">
                  Tuesday - Sunday
                  <br />
                  10:00 AM - 6:00 PM
                  <br />
                  Closed on Mondays
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105">
                <TicketIcon
                  size={48}
                  className="mx-auto text-purple-600 mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Visitor Guidelines
                </h3>
                <p className="text-gray-600">
                  Masks recommended
                  <br />
                  No flash photography
                  <br />
                  No food or drinks inside gallery
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Replace the existing "About Our Gallery" section with this */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">
              A Legacy of Artistic Innovation
            </h2>
            <div className="text-center space-y-6">
              <p className="text-xl   text-gray-700 leading-relaxed">
                Since its inception in the heart of Bujumbura, Burundi, in 2020,
                l'Horizon des Arts has been more than a gallery—it is a vibrant
                cultural bridge connecting diverse artistic voices from around
                the globe. Born out of a passion for fostering creativity and
                dialogue, we are committed to challenging perspectives,
                nurturing talent, and inspiring transformative experiences
                through art.
              </p>
              <p className="text-lg text-gray-600 italic">
                "Ikibira gihinyitse ni co cerekana umuhinyanyuzi w’umuhanga." —
                a burundian quote
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Home;
    
 