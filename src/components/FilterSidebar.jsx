import { useState } from "react";

export default function FilterSidebar({ onApply }) {
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);

  const handleApply = () => {
    onApply?.({ maxPrice, minRating });
  };

  return (
    <aside className="bg-white rounded-lg shadow-sm p-5 h-fit sticky top-4">
      <h3 className="font-display font-semibold text-lg mb-4">Filters</h3>

      <div className="mb-5">
        <label className="text-sm text-ink/70 block mb-2">
          Max price: ₹{maxPrice}
        </label>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-coral"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm text-ink/70 block mb-2">Minimum rating</label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-3 py-1 rounded-md text-sm border ${
                minRating === r
                  ? "bg-teal text-sand border-teal"
                  : "border-sage text-ink/70"
              }`}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-coral hover:bg-coral-dark text-white rounded-md py-2 text-sm font-medium transition-colors"
      >
        Apply filters
      </button>
    </aside>
  );
}
