import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function NewsletterSection() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        // Simulate network
        await new Promise((r) => setTimeout(r, 600));
        toast.success("Subscribed successfully! Travel alerts enabled.");
        reset();
    };

    return (
        <section className="bg-sand text-ink dark:bg-slate-950 dark:text-sand py-20 px-6 border-b border-ink/5 dark:border-sand/5">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Never Miss a Trip</h2>
                    <p className="text-ink/70 dark:text-sand/70 mb-8 max-w-lg mx-auto">
                        Join our newsletter and receive curated travel deals, new destination launches, and exclusive alerts directly in your inbox.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto relative flex flex-col sm:flex-row gap-3">
                        <div className="flex-grow text-left">
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 rounded-md bg-white dark:bg-slate-900 border border-ink/20 dark:border-sand/20 focus:outline-none focus:ring-2 ring-teal"
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1 block absolute -bottom-6">{errors.email.message}</span>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
                        >
                            {isSubmitting ? "Subscribing..." : "Subscribe"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
