import { React, useState } from 'react'

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState("");

  // Obtenir la date actuelle au format AAAA-MM-JJ
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ajouter un zéro au début si nécessaire
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen  ">
      <div className="bg-orange-300 w-5/12 rounded-xl p-3 shadow-2xl shadow-orange-950">
        <h1 className="text-center font-parkinSans underline text-3xl text-orange-800">
          Take a simple visit
        </h1>
        <div className="mt-3">
          <label htmlFor="username" className="text-white">
            Fullname:
          </label>
          <input
            type="text"
            name=""
            id="username"
            className="border block rounded-full shadow-lg w-3/5 focus:w-full focus:transition-all focus:duration-700 focus:outline-none h-10 mt-3 my-3 px-3 "
            placeholder="e.g: IZERE Olivier"
          />
          <label htmlFor="email" className="text-white">
            Email:
          </label>
          <input
            type="email"
            name=""
            id="email"
            className="border block rounded-full shadow-lg h-10 mt-3 my-3 px-3 w-4/5 focus:w-full focus:transition-all focus:duration-700 focus:outline-none"
            placeholder="izereolivier@gmail.com"
          />
          <div className="mt-6 flex items-center ">
            <label htmlFor="date" className="text-white">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={getCurrentDate()}
              className="ml-7 bg-transparent " // Bloque les dates passées
            />
          </div>
          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-800 py-1 text-white rounded-lg mt-5 hover:text-orange-950 hover:transition-all hover:duration-300 ">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking