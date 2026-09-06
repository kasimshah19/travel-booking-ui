import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/useStore";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // As properly designed in AuthController, this creates the user and logs them in
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.accessToken);
      toast.success("Account created successfully! Welcome.");
      navigate("/");
    } catch (err) {
      if (Array.isArray(err.response?.data?.error)) {
        setErrorMsg(err.response.data.error[0]?.message || 'Validation error');
      } else {
        setErrorMsg(err.response?.data?.error || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-display font-semibold mb-1 dark:text-sand">Create account</h1>
      <p className="text-ink/60 mb-6 text-sm dark:text-sand/60">Start planning your next trip.</p>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-ink/70 block mb-1 dark:text-sand/70">Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70 block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70 block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-sage rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark text-white rounded-md py-2.5 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Sign up'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-4 text-center dark:text-sand/60">
        Already have an account?{" "}
        <Link to="/login" className="text-coral underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
