import { motion } from "framer-motion";
import { Trees, Mountain, Castle, Tent, Ship, Palmtree } from "lucide-react";

export default function CategoryTiles({ onSelect }) {
    const categories = [
        { name: "Beach", icon: Palmtree, value: "BEACH" },
        { name: "Mountain", icon: Mountain, value: "MOUNTAIN" },
        { name: "Heritage", icon: Castle, value: "HERITAGE" },
        { name: "Wildlife", icon: Trees, value: "WILDLIFE" },
        { name: "Hill Station", icon: Tent, value: "HILL_STATION" },
        { name: "Backwaters", icon: Ship, value: "BACKWATERS" }
    ];

    return (
        <section className="max-w-6xl mx-auto px-6 py-10 -mt-16 relative z-10 w-full">
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map((cat, i) => (
                    <motion.button
                        key={cat.value}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        onClick={() => onSelect(cat.value)}
                        className="bg-white dark:bg-slate-800 text-ink dark:text-sand shadow-lg flex flex-col items-center justify-center p-4 rounded-xl w-32 h-28 border border-sand/50 dark:border-slate-700/50 hover:border-teal dark:hover:border-teal transition-colors"
                    >
                        <cat.icon size={28} className="mb-3 text-teal dark:text-teal-light" />
                        <span className="font-semibold text-sm">{cat.name}</span>
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
