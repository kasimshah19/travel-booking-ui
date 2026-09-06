import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";

// Form validation schema
const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export default function Contact() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data) => {
        // Simulating API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Contact API Call:", data);
                alert("Thanks for contacting us, we will reach back to you soon!");
                reset();
                resolve();
            }, 1500);
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 py-16"
        >
            <div className="text-center mb-16">
                <h1 className="text-4xl font-display font-semibold mb-4 text-ink dark:text-sand">
                    Get in Touch
                </h1>
                <p className="text-ink/60 dark:text-sand/60 max-w-xl mx-auto">
                    Have a question about your booking, or need suggestions for your next trip? Our team is here to help you 24/7.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Contact Information */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-display font-semibold dark:text-sand">Contact Information</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-teal/10 dark:bg-teal/20 rounded-full text-teal dark:text-teal-light">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-ink dark:text-sand">Office Address</h3>
                                <p className="text-ink/60 dark:text-sand/60 text-sm mt-1">
                                    123 Wanderlust Ave, Travel City,<br />
                                    TC 10010, World
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-teal/10 dark:bg-teal/20 rounded-full text-teal dark:text-teal-light">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-ink dark:text-sand">Email Us</h3>
                                <p className="text-ink/60 dark:text-sand/60 text-sm mt-1">
                                    support@wanderlist.com<br />
                                    bookings@wanderlist.com
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-teal/10 dark:bg-teal/20 rounded-full text-teal dark:text-teal-light">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-ink dark:text-sand">Call Us</h3>
                                <p className="text-ink/60 dark:text-sand/60 text-sm mt-1">
                                    +1 (555) 123-4567<br />
                                    Mon-Fri, 9am-6pm (EST)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-sage/40 dark:border-slate-700">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-ink/80 dark:text-sand/80 block mb-1">Your Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                                className="w-full border border-sage/60 dark:border-slate-600 dark:bg-slate-700 dark:text-sand rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal transition-all"
                            />
                            {errors.name && <p className="text-coral text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-ink/80 dark:text-sand/80 block mb-1">Your Email</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                {...register("email")}
                                className="w-full border border-sage/60 dark:border-slate-600 dark:bg-slate-700 dark:text-sand rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal transition-all"
                            />
                            {errors.email && <p className="text-coral text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-ink/80 dark:text-sand/80 block mb-1">Message</label>
                            <textarea
                                rows="4"
                                placeholder="How can we help you?"
                                {...register("message")}
                                className="w-full border border-sage/60 dark:border-slate-600 dark:bg-slate-700 dark:text-sand rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal transition-all resize-none"
                            />
                            {errors.message && <p className="text-coral text-xs mt-1">{errors.message.message}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-teal hover:bg-teal-light text-sand rounded-lg py-3 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 border-2 border-sand border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Send Message"
                            )}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
