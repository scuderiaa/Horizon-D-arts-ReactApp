import React, { useState } from "react";
import {Palette,CalendarCheck,UserCircle, Amphora } from "lucide-react";
import Artwork from "./Admin-Artwork";
import Exhibition from "./Admin-Exhibition";
import Bookings from "./Admin-Bookings";
const ArtGalleryApp = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Artwork />;
      case "artists":
        return <Bookings />;
      case "exhibitions":
        return <Exhibition />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-parkinSans">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-lime-100  shadow-lg">
        <div className="p-6 text-center flex items-center gap-1">
          <UserCircle />
          <h1 className="text-2xl font-bold text-gray-800 underline">
            Admin Panel
          </h1>
        </div>
        <nav className="">
          <NavItem
            icon={<Palette />}
            label="ArtWorks"
            onClick={() => setActiveSection("home")}
            active={activeSection === "home"}
          />
          <NavItem
            icon={<Amphora />}
            label="Exhibitions"
            onClick={() => setActiveSection("exhibitions")}
            active={activeSection === "exhibitions"}
          />
          <NavItem
            icon={<CalendarCheck />}
            label="Bookings"
            onClick={() => setActiveSection("artists")}
            active={activeSection === "artists"}
          />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-2 w-full">{renderSection()}</div>
    </div>
  );
};

const NavItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center p-4 
      ${active ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100"}
      transition-colors duration-200
    `}
  >
    {React.cloneElement(icon, { className: "mr-4" })}
    {label}
  </button>
);

const HomeSection = () => (
    <div>
    
    </div>
);

const ArtistsSection = () => (
  <></>
);

const ExhibitionsSection = () => (
  <div>
    
  </div>
);

const ContactSection = () => (
  <div>
    
  </div>
);

export default ArtGalleryApp;
