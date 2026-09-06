import { useLocation, Link } from "react-router-dom";

export default function Confirmation() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">No booking found.</p>
        <Link to="/" className="text-coral underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-display font-semibold mb-3">
        You're all set, {state.name.split(" ")[0]}!
      </h1>
      <p className="text-ink/70 mb-8">
        Your trip to {state.destination.name} is booked for {state.guests} guest(s).
        A confirmation has been sent to {state.email}.
      </p>
      <Link
        to="/"
        className="bg-teal hover:bg-teal-light text-sand px-6 py-3 rounded-md inline-block transition-colors"
      >
        Book another trip
      </Link>
    </div>
  );
}
