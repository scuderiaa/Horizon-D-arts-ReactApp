import React from "react";
import { NavLinks } from "../constants/utils";
import { Link, NavLink} from "react-router";

const Header = () => {
  return (
    <div>
      <div  className="flex justify-between mx-auto max-w-5xl my-3 items-center">
        
          <Link
            to="/"
            className="flex justify-center gap-2 items-center font-playWrite font-bold text-2xl text-amber-600"
          >
            {/* <img src="/icon.png" alt="" className="size-12" /> */}
            <p> L'Horizon des Arts</p>
          </Link>
        <div className="flex space-x-7 justify-center items-center">
          <ul className="flex space-x-7">
            {NavLinks.map((item) => (
              <li
                key={item.id}
                className=" text-amber-600  hover:text-orange-800 hover:transition-all hover:duration-300 hover:underline font-parkinSans"
              >
                <NavLink to={item.to}>{item.name}</NavLink>
              </li>
            ))}
          </ul>
          {/* <Link
            to="/booking"
            className="bg-gradient-to-r from-orange-400 to-orange-700 font-parkinSans text-white p-2 rounded-full  hover:text-orange-950  hover:transition-all hover:duration-300"
          >
            Book a visit
          </Link> */}
        </div>
      </div>
      <hr className="bg-gradient-to-r from-orange-300 to-orange-800  p-[1px] max-w-6xl mx-auto" />
      
    </div>
  );
};

export default Header;
