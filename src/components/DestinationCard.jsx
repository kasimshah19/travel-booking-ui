import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function DestinationCard({ destination }) {
  const { id, name, country, basePrice, image, rating } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
    >
      <img src={image} alt={name} className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-ink dark:text-sand">{name}</h3>
            <p className="text-sm text-ink/60 dark:text-sand/60">{country}</p>
          </div>
          <span className="text-sm bg-sage/40 text-teal dark:text-sand dark:bg-teal-light px-2 py-0.5 rounded-full">
            ★ {rating}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-teal dark:text-coral font-semibold">
            ₹{basePrice}
            <span className="text-xs text-ink/50 dark:text-sand/50 font-normal"> / night</span>
          </p>
          <Link
            to={`/booking/${id}`}
            className="text-sm bg-teal hover:bg-teal-light text-sand px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            Book now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
