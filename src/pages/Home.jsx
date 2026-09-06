import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import FilterSidebar from "../components/FilterSidebar";
import api from "../api/axios";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [filters, setFilters] = useState({ maxPrice: 10000, minRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get('/destinations');
        // Map Prisma camelCase if needed, but they are same as schema
        setDestinations(data);
      } catch (err) {
        console.error("Failed to fetch destinations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filtered = destinations.filter(
    (d) => d.basePrice <= filters.maxPrice && d.rating >= filters.minRating
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <section className="bg-teal dark:bg-slate-950 text-sand px-6 pt-16 pb-24 text-center transition-colors">
        <h1 className="text-4xl md:text-5xl font-display font-semibold mb-3">
          Find your next trip
        </h1>
        <p className="text-sage max-w-xl mx-auto">
          Compare stays, pick your dates, and book in a few clicks.
        </p>
      </section>

      <SearchBar onSearch={(f) => console.log("Search filters:", f)} />

      <section id="destinations" className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <FilterSidebar onApply={setFilters} />

        <div className="md:col-span-3">
          <h2 className="text-2xl font-display font-semibold mb-6 dark:text-sand">
            Popular destinations
          </h2>
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
            {filtered.length === 0 && (
              <p className="text-ink/60 dark:text-sand/60">No destinations match these filters.</p>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
