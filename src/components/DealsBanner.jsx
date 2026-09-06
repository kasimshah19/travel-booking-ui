import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function DealsBanner({ compact = false }) {
    const [timeLeft, setTimeLeft] = useState(48 * 60 * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal to-teal-light dark:from-slate-800 dark:to-slate-900 shadow-xl ${compact ? "my-8" : "mb-16"}`}
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-coral opacity-20 blur-3xl"></div>

            <div className={`relative z-10 text-sand ${compact ? "p-8 md:p-10 flex flex-col md:flex-row justify-between items-center" : "p-10 md:p-14 md:flex justify-between items-center"}`}>
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-coral/20 border border-coral text-white dark:text-coral font-semibold text-sm rounded-full mb-4">
                        <Flame size={16} className="text-coral" /> <span className="text-coral-dark dark:text-coral">Flash Sale Live</span>
                    </div>
                    <h2 className={`font-display font-bold mb-4 leading-tight ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}`}>
                        Unmissable Travel Deals
                    </h2>
                    <p className="text-sand/80 text-lg mb-6 md:mb-0">
                        Unlock up to 40% off on hand-picked premium destinations. These jaw-dropping offers won't last forever!
                    </p>
                    {compact && (
                        <Link to="/deals" className="inline-block bg-white text-teal font-semibold px-6 py-3 rounded-lg shadow hover:bg-sand transition-colors mt-2">
                            See all deals
                        </Link>
                    )}
                </div>
                <div className={`hidden md:flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mt-6 md:mt-0 shadow-sm ${compact ? "ml-6" : ""}`}>
                    <Clock size={32} className="mb-2 text-coral" />
                    <span className="font-semibold text-2xl tracking-wider">{formatTime(timeLeft)}</span>
                    <span className="text-xs text-sand/70 uppercase tracking-widest mt-1">Offers End Soon</span>
                </div>
            </div>
        </motion.div>
    );
}
