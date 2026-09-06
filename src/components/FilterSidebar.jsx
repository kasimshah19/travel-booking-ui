import { useState, useEffect, useMemo } from "react";

export default function FilterSidebar({ onApply, destinations = [] }) {
  const [maxPrice, setMaxPrice] = useState(30000);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("recommended"); // price_asc, price_desc, rating_desc

  // Derive distinct amenities dynamically
  const availableAmenities = useMemo(() => {
    const allAmenities = destinations.flatMap(d => d.amenities || []);
    return [...new Set(allAmenities)].sort();
  }, [destinations]);

  // Derive categories from actual destinations or enum values
  const availableCategories = useMemo(() => {
    const allCategories = destinations.map(d => d.category).filter(Boolean);
    return [...new Set(allCategories)];
  }, [destinations]);

  // Grouped Apply handler (could also just auto-apply inside useEffect)
  useEffect(() => {
    onApply?.({ maxPrice, minRating, selectedCategories, selectedAmenities, sortBy });
  }, [maxPrice, minRating, selectedCategories, selectedAmenities, sortBy, onApply]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }

  const toggleAmenity = (am) => {
    setSelectedAmenities(prev => prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am]);
  }

  return (
    <aside className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-5 h-fit sticky top-4 border border-sand/50 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-semibold text-lg text-ink dark:text-sand">Filters</h3>
        <button
          onClick={() => { setMaxPrice(30000); setMinRating(0); setSelectedCategories([]); setSelectedAmenities([]); setSortBy("recommended"); }}
          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
        >
          Clear all
        </button>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-ink dark:text-sand block mb-2">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full p-2 text-sm border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-sand rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="recommended">Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Top Rated</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-ink dark:text-sand block mb-2">
          Max price: ₹{maxPrice}
        </label>
        <input
          type="range"
          min="1000"
          max="30000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-ink/50 dark:text-sand/50 mt-1">
          <span>₹1k</span>
          <span>₹30k</span>
        </div>
      </div>

      <div className="mb-6 border-t border-ink/5 dark:border-sand/5 pt-4">
        <label className="text-sm font-semibold text-ink dark:text-sand block mb-3">Trip Type</label>
        <div className="space-y-2">
          {availableCategories.map(cat => {
            const display = cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            return (
              <label key={cat} className="flex items-center gap-2 text-sm text-ink/80 dark:text-sand/80 cursor-pointer">
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="rounded text-blue-600 focus:ring-blue-500 bg-sand dark:bg-slate-800 border-ink/20 dark:border-sand/20" />
                {display}
              </label>
            )
          })}
        </div>
      </div>

      <div className="mb-6 border-t border-ink/5 dark:border-sand/5 pt-4">
        <label className="text-sm font-semibold text-ink dark:text-sand block mb-2">Minimum Rating</label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex-1 py-1 rounded-md text-sm border font-medium ${minRating === r
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-sage bg-white dark:bg-slate-800 text-ink/70 dark:text-sand border-slate-200 dark:border-slate-700 hover:border-blue-400"
                }`}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {availableAmenities.length > 0 && (
        <div className="border-t border-ink/5 dark:border-sand/5 pt-4">
          <label className="text-sm font-semibold text-ink dark:text-sand block mb-3">Amenities</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableAmenities.map(am => (
              <label key={am} className="flex items-center gap-2 text-sm text-ink/80 dark:text-sand/80 cursor-pointer break-words">
                <input type="checkbox" checked={selectedAmenities.includes(am)} onChange={() => toggleAmenity(am)} className="rounded text-blue-600 focus:ring-blue-500 bg-sand dark:bg-slate-800 border-ink/20 dark:border-sand/20 shrink-0" />
                <span className="leading-tight">{am}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
