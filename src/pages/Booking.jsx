import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm";
import api from "../api/axios";

export default function Booking() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDest = async () => {
      try {
        const { data } = await api.get(`/destinations/${id}`);
        setDestination(data);
      } catch (err) {
        console.error("Failed to load destination");
      } finally {
        setLoading(false);
      }
    };
    fetchDest();
  }, [id]);

  if (loading) return <p className="text-center py-16 text-ink dark:text-sand">Loading destination...</p>;

  if (!destination) {
    return <p className="text-center py-16 text-ink dark:text-sand">Destination not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-display font-semibold mb-1 dark:text-sand">
        Book {destination.name}
      </h1>
      <p className="text-ink/60 dark:text-sand/60 mb-6">
        {destination.country} · ₹{destination.basePrice} / night
      </p>
      <BookingForm destination={destination} />
    </div>
  );
}
