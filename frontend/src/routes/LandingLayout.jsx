import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

export default function LandingLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer/>
    </div>
  );
}
