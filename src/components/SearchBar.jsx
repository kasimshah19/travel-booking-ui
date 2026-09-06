import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ destination, checkIn, checkOut, guests });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 -mt-10 relative z-10 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:col-span-2">
        <label className="text-xs text-ink/60 mb-1">Destination</label>
        <input
          type="text"
          placeholder="Where do you want to go?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-ink/60 mb-1">Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-ink/60 mb-1">Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-ink/60 mb-1">Guests</label>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
        />
      </div>

      <button
        type="submit"
        className="md:col-span-5 bg-coral hover:bg-coral-dark text-white rounded-md py-2.5 font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
}
