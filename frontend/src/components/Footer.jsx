import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-400 to-orange-700 text-white font-parkinSans py-12 px-8">
      <div className="container mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Gallery</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Exhibitions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Collections
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Artists
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Visit</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Hours
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Location
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Tickets
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Connect</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Newsletter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300  transition-colors">
                Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-white">
        © 2024 L'Horizon des Arts. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
