import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/useStore";

export default function BookingForm({ destination }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [form, setForm] = useState({ date: "", slot: "MORNING" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await api.post("/bookings", {
        destinationId: destination.id,
        date: form.date, // e.g., YYYY-MM-DD
        slot: form.slot,
      });

      // API returned a PENDING booking. Navigate to payment with its ID.
      navigate("/payment", { state: { destination, bookingId: response.data.booking.id } });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Failed to create booking.");
      // Note: If 409 'This slot is already booked', the user just sees the error message 
      // and can pick another date or slot.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="text-sm text-ink/70 dark:text-sand/70 block mb-1">Select Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          required
          onChange={handleChange}
          className="w-full border border-sage dark:border-slate-700 dark:bg-slate-900 rounded-md px-3 py-2 text-ink dark:text-sand focus:outline-none focus:ring-2 focus:ring-coral transition-colors"
        />
      </div>

      <div>
        <label className="text-sm text-ink/70 dark:text-sand/70 block mb-1">Time Slot</label>
        <select
          name="slot"
          value={form.slot}
          onChange={handleChange}
          className="w-full border border-sage dark:border-slate-700 dark:bg-slate-900 rounded-md px-3 py-2 text-ink dark:text-sand focus:outline-none focus:ring-2 focus:ring-coral transition-colors"
        >
          <option value="MORNING">Morning (9 AM - 12 PM)</option>
          <option value="AFTERNOON">Afternoon (1 PM - 4 PM)</option>
          <option value="EVENING">Evening (5 PM - 8 PM)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-coral hover:bg-coral-dark text-white rounded-md py-3 font-medium transition-colors disabled:opacity-50"
      >
        {isLoading ? "Checking availability..." : "Book Now"}
      </button>
    </form>
  );
}
