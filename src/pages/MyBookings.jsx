import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast";
import { MapPin, Calendar, Clock, CreditCard, ChevronRight, XCircle } from "lucide-react";

const CANCELLATION_FULL_REFUND_HOURS = 48; // Must match backend

const StatusBadge = ({ status }) => {
    const colors = {
        PENDING: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        CANCELLED: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        EXPIRED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || colors.PENDING}`}>
            {status}
        </span>
    );
};

const PaymentBadge = ({ payment }) => {
    if (!payment) return null;

    if (['PENDING_REFUND', 'REFUNDED', 'REFUND_FAILED'].includes(payment.status)) {
        return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 mt-2 inline-block">
                Refund: {payment.status.replace('_', ' ')}
            </span>
        );
    }
    return null;
};

export default function MyBookings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [data, setData] = useState({ upcoming: [], history: [], hasMore: false });
    const [loading, setLoading] = useState(true);

    // Cancellation Modal State
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const fetchBookings = async () => {
        try {
            // Basic limit fetches overall to populate tabs.
            const response = await api.get('/bookings/me?limit=50');
            setData(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // Refetch when window regains focus (e.g., returning from payment tab/webhook)
        const handleFocus = () => fetchBookings();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const openCancelModal = (booking) => {
        setBookingToCancel(booking);
        setCancelModalOpen(true);
    };

    const handleCancel = async () => {
        if (!bookingToCancel) return;
        setCancelLoading(true);
        try {
            const response = await api.post(`/bookings/${bookingToCancel.id}/cancel`);
            toast.success(response.data.message || "Booking cancelled", { duration: 5000 });
            setCancelModalOpen(false);
            setBookingToCancel(null);
            // Refresh strictly in-place/refetch
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to cancel booking.");
        } finally {
            setCancelLoading(false);
        }
    };

    const calculateHoursToTrip = (dateString) => {
        const tripDate = new Date(dateString);
        return (tripDate.getTime() - Date.now()) / (1000 * 60 * 60);
    };

    const renderBookingCard = (booking, index) => {
        const isPending = booking.status === 'PENDING';
        const isConfirmed = booking.status === 'CONFIRMED';
        const hasExpired = isPending && booking.reservationExpiresAt && new Date(booking.reservationExpiresAt) < new Date();

        // Frontend safety check for expiry (in case sweep hasn't run)
        const displayStatus = hasExpired ? 'EXPIRED' : booking.status;

        return (
            <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-sage/50 dark:border-slate-700 p-5 flex flex-col md:flex-row gap-6"
            >
                <div className="md:w-1/4">
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-sage/20">
                        <img
                            src={booking.destination.imagePath}
                            alt={booking.destination.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-display font-semibold dark:text-sand">{booking.destination.name}</h3>
                            <div className="flex flex-col items-end">
                                <StatusBadge status={displayStatus} />
                                <PaymentBadge payment={booking.payment} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm text-ink/70 dark:text-sand/70">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{booking.slot}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{booking.destination.country || 'International'}</span>
                            </div>
                            {booking.payment && (
                                <div className="flex items-center gap-2 font-medium">
                                    <CreditCard size={16} />
                                    <span>₹{booking.payment.amount}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        {isConfirmed && displayStatus !== 'EXPIRED' && (
                            <button
                                onClick={() => openCancelModal(booking)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium px-4 py-2 border border-red-200 dark:border-red-900/50 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                            >
                                <XCircle size={16} /> Cancel Booking
                            </button>
                        )}

                        {isPending && !hasExpired && (
                            <button
                                onClick={() => navigate('/payment', { state: { bookingId: booking.id } })}
                                className="bg-coral hover:bg-coral-dark text-white px-5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                Complete Payment <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    const activeData = activeTab === 'upcoming' ? data.upcoming : data.history;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 min-h-[70vh]">
            <h1 className="text-3xl font-display font-semibold mb-8 dark:text-sand">My Bookings</h1>

            <div className="flex gap-4 border-b border-sage dark:border-slate-700 mb-8">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'upcoming' ? 'text-coral' : 'text-ink/60 dark:text-sand/60 hover:text-ink'}`}
                >
                    Upcoming Trips
                    {activeTab === 'upcoming' && (
                        <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'history' ? 'text-coral' : 'text-ink/60 dark:text-sand/60 hover:text-ink'}`}
                >
                    Past & Cancelled
                    {activeTab === 'history' && (
                        <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral" />
                    )}
                </button>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 rounded-xl bg-sage/20 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : activeData.length === 0 ? (
                <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-sage/50 dark:border-slate-700 border-dashed">
                    <p className="text-ink/60 dark:text-sand/60 mb-4">No bookings found in this section.</p>
                    <Link to="/deals" className="text-coral font-medium hover:underline">Explore Deals & Destinations</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {activeData.map((booking, i) => renderBookingCard(booking, i))}
                    </AnimatePresence>
                </div>
            )}

            {/* Cancellation Warning Modal */}
            {cancelModalOpen && bookingToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-sage/50 dark:border-slate-700"
                    >
                        <h3 className="text-xl font-display font-semibold mb-2 dark:text-sand">Cancel Booking?</h3>
                        <p className="text-sm text-ink/70 dark:text-sand/70 mb-4">
                            Are you sure you want to cancel your trip to <strong className="text-ink dark:text-sand">{bookingToCancel.destination.name}</strong> on {new Date(bookingToCancel.date).toLocaleDateString()}? This action cannot be undone.
                        </p>

                        <div className="bg-sage/20 dark:bg-slate-800 rounded-lg p-4 mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-sand/50 mb-1">Refund Policy Notice</h4>
                            {calculateHoursToTrip(bookingToCancel.date) >= CANCELLATION_FULL_REFUND_HOURS ? (
                                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                                    Travel date is {Math.round(calculateHoursToTrip(bookingToCancel.date))} hours away. Full refund of ₹{bookingToCancel.payment?.amount || 0} will be initiated.
                                </p>
                            ) : (
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    Travel date is in less than {CANCELLATION_FULL_REFUND_HOURS} hours. No refund will be issued per cancellation policy.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setCancelModalOpen(false)}
                                disabled={cancelLoading}
                                className="px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand/70 dark:hover:text-sand transition-colors"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelLoading}
                                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                            >
                                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
