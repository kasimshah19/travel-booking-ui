import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DestinationCard from "../components/DestinationCard";
import DealsBanner from "../components/DealsBanner";
import api from "../api/axios";

export default function Deals() {
    const [dealDestinations, setDealDestinations] = useState([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const { data } = await api.get('/destinations');
                const deals = data.filter(dest => dest.originalPrice && dest.originalPrice > dest.basePrice).slice(0, 3);
                setDealDestinations(deals);
            } catch (err) {
                console.error("Failed to fetch deals", err);
            }
        };
        fetchDeals();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-16"
        >
            <DealsBanner />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dealDestinations.map((dest) => (
                    <DestinationCard key={dest.id} destination={dest} />
                ))}
            </div>
        </motion.div>
    );
}
