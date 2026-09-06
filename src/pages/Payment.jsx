import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!state || !state.bookingId) {
    return <p className="text-center py-16 text-ink dark:text-sand">No valid booking session found. Please start over.</p>;
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create Order on Backend
      const { data: orderData } = await api.post(`/bookings/${state.bookingId}/create-payment-order`);

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.key_id, // Safe key for frontend
        amount: orderData.amount * 100, // paise
        currency: orderData.currency,
        name: "Travel Booking",
        description: "Secure Payment",
        order_id: orderData.razorpay_order_id,
        handler: async (response) => {
          // 3. Verify Payment on Backend
          try {
            await api.post(`/bookings/${state.bookingId}/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            // ONLY redirect after backend verifies the signature atomically
            navigate("/confirmation", { state });
          } catch (verifyErr) {
            setErrorMsg(verifyErr.response?.data?.error || "Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#0d8bf2" // Ocean deep / Dodger Blue theme
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        setErrorMsg(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Unable to initiate payment setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-2xl font-display font-semibold mb-1 dark:text-sand">Complete Payment</h1>
      <p className="text-ink/60 dark:text-sand/60 mb-6">
        Total: <span className="text-teal dark:text-teal-light font-semibold">₹{state.destination?.basePrice || "..."}</span>
      </p>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
        <p className="text-sm text-ink/80 dark:text-sand/80">
          You will be redirected securely to Razorpay to complete your transaction via UPI, Netbanking, or Card.
        </p>
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark text-white rounded-md py-3 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Initializing..." : "Pay securely via Razorpay"}
        </button>
      </div>
    </div>
  );
}
