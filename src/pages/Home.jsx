import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import FilterSidebar from "../components/FilterSidebar";
import CategoryTiles from "../components/CategoryTiles";
import DealsBanner from "../components/DealsBanner";
import TrustSection from "../components/TrustSection";
import NewsletterSection from "../components/NewsletterSection";
import api from "../api/axios";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [filters, setFilters] = useState({ maxPrice: 30000, minRating: 0 }); // Increased default maxPrice for new seed data
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get('/destinations');
        setDestinations(data);
      } catch (err) {
        console.error("Failed to fetch destinations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filtered = useMemo(() => {
    let result = destinations.filter((d) => {
      const priceMatch = d.basePrice <= (filters.maxPrice ?? 30000);
      const ratingMatch = d.rating >= (filters.minRating ?? 0);

      // Category match (URL + Sidebar)
      const activeCategories = new Set(filters.selectedCategories || []);
      if (selectedCategory) activeCategories.add(selectedCategory);
      const categoryMatch = activeCategories.size > 0 ? activeCategories.has(d.category) : true;

      // Amenity match (must have ALL selected amenities)
      const reqAmenities = filters.selectedAmenities || [];
      const amenityMatch = reqAmenities.length > 0
        ? reqAmenities.every(req => (d.amenities || []).includes(req))
        : true;

      return priceMatch && ratingMatch && categoryMatch && amenityMatch;
    });

    // Sorting
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (filters.sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [destinations, filters, selectedCategory]);

  const handleCategorySelect = (catValue) => {
    if (selectedCategory === catValue) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catValue);
    }
    setSearchParams(searchParams);

    // Smooth scroll to destinations ID
    document.getElementById("destinations")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
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

        <CategoryTiles onSelect={handleCategorySelect} />

        <SearchBar onSearch={(f) => console.log("Search filters:", f)} />

        <section id="destinations" className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-6 scroll-mt-20">
          <FilterSidebar onApply={setFilters} destinations={destinations} />

          <div className="md:col-span-3">
            <h2 className="text-2xl font-display font-semibold mb-6 dark:text-sand">
              {selectedCategory
                ? `${selectedCategory.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Destinations`
                : 'Popular destinations'}
            </h2>
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
            >
              {filtered.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
              {filtered.length === 0 && !loading && (
                <p className="text-ink/60 dark:text-sand/60 col-span-full">No destinations match these filters.</p>
              )}
              {loading && <p className="text-ink/60 dark:text-sand/60 col-span-full">Loading...</p>}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <DealsBanner compact={true} />
        </section>

      </motion.div>
      <TrustSection />
      <NewsletterSection />
    </>
  );
}
