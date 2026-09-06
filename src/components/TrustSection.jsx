import { motion } from "framer-motion";
import { ShieldCheck, Zap, Receipt } from "lucide-react";

export default function TrustSection() {
    return (
        <section className="bg-slate-900 border-t border-slate-800 text-sand py-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="bg-slate-800 p-4 rounded-full mb-4 text-teal-light">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-display font-semibold mb-2">Instant Confirmation</h3>
                        <p className="text-sand/70">Real-time database locks ensure zero double-booking and immediate reservation guarantee.</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="bg-slate-800 p-4 rounded-full mb-4 text-coral">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-display font-semibold mb-2">Secure Payments</h3>
                        <p className="text-sand/70">Razorpay-secured transactions with rigorous server-side signature verification.</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="bg-slate-800 p-4 rounded-full mb-4 text-teal-light">
                            <Receipt size={32} />
                        </div>
                        <h3 className="text-xl font-display font-semibold mb-2">Clear Cancellations</h3>
                        <p className="text-sand/70">A transparent 48-hour automated refund window via Razorpay API.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
