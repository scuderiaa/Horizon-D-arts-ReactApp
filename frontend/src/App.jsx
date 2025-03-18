import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { FeaturedArtworksProvider } from "./routes/featured-artworks";
import LandingLayout from "./routes/LandingLayout";
import Home from "./routes/Home";
import AboutUs from "./routes/AboutUs";
import Exhibitions from "./routes/Exhibitions";
import Booking from "./routes/Booking";
import AuthAdmin from "./Admin_auth";
import Admin_Panel from "./Admin-Panel";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NotFound from "./routes/NotFound";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <FeaturedArtworksProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/exhibitions" element={<Exhibitions />} />
              <Route path="/booking" element={<Booking />} />
            </Route>
            <Route path="/admin" element={<AuthAdmin />} />
            <Route path="/admin/panel" element={<Admin_Panel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FeaturedArtworksProvider>
    </Elements>
  );
}

export default App;
