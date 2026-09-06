export default function Footer() {
  return (
    <footer className="bg-teal text-sage px-6 py-8 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-sand font-display text-lg mb-1">Wanderlist</p>
          <p className="text-sm">Book your next trip without the guesswork.</p>
        </div>
        <div className="flex gap-10 text-sm">
          <div>
            <p className="text-sand mb-2">Company</p>
            <p>About</p>
            <p>Careers</p>
          </div>
          <div>
            <p className="text-sand mb-2">Support</p>
            <p>Help centre</p>
            <p>Cancellations</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-center mt-8 opacity-70">
        © {new Date().getFullYear()} Wanderlist. Built for demo purposes.
      </p>
    </footer>
  );
}
