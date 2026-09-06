import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wifi, Coffee, Waves, Tv, MapPin } from "lucide-react";

export default function DestinationCard({ destination }) {
  const { id, name, location, basePrice, originalPrice, imagePath, rating, amenities } = destination;

  // Calculate discount percentage
  const discount = originalPrice ? Math.round(((originalPrice - basePrice) / originalPrice) * 100) : null;

  // Map amenity string to Icon
  const getAmenityIcon = (amenityStr) => {
    const lower = amenityStr.toLowerCase();
    if (lower.includes('wifi')) return <Wifi size={14} className="mr-1" />;
    if (lower.includes('pool') || lower.includes('beach') || lower.includes('lake') || lower.includes('river')) return <Waves size={14} className="mr-1" />;
    if (lower.includes('breakfast') || lower.includes('meal') || lower.includes('dining')) return <Coffee size={14} className="mr-1" />;
    return <Tv size={14} className="mr-1" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow relative flex flex-col h-full"
    >
      {discount && (
        <div className="absolute top-4 right-4 bg-coral text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md">
          {discount}% OFF
        </div>
      )}
      <img src={imagePath} alt={name} className="w-full h-52 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-display font-semibold text-ink dark:text-sand leading-snug">{name}</h3>
            <p className="text-sm text-ink/60 dark:text-sand/60 flex items-center mt-1">
              <MapPin size={14} className="mr-1" />
              {location}
            </p>
          </div>
          <span className="text-sm bg-sage/40 text-teal dark:text-sand dark:bg-teal-light px-2 py-0.5 rounded-full font-medium shadow-sm whitespace-nowrap">
            ★ {rating}
          </span>
        </div>

        {/* Amenities row */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap items-center mt-3 text-ink/50 dark:text-sand/50 text-xs gap-3">
            {amenities.slice(0, 3).map((am, i) => (
              <div key={i} className="flex items-center" title={am}>
                {getAmenityIcon(am)}
                <span>{am}</span>
              </div>
            ))}
            {amenities.length > 3 && <span className="opacity-70">+{amenities.length - 3}</span>}
          </div>
        )}

        <div className="flex items-end justify-between mt-auto pt-5">
          <div>
            {originalPrice && (
              <span className="text-xs line-through text-ink/40 dark:text-sand/40 mr-2 block">
                ₹{originalPrice}
              </span>
            )}
            <p className="text-teal dark:text-coral font-semibold text-lg leading-none">
              ₹{basePrice}
              <span className="text-xs text-ink/50 dark:text-sand/50 font-normal"> / night</span>
            </p>
          </div>
          <Link
            to={`/booking/${id}`}
            className="text-sm bg-teal hover:bg-teal-light text-sand px-5 py-2.5 rounded-md transition-colors shadow-sm font-medium"
          >
            Book now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
