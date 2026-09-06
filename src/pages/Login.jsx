import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useStore";
import toast from "react-hot-toast";

import api from "../api/axios";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.user, response.data.accessToken);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Failed to login");
      toast.error("Login failed!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-sm mx-auto px-6 py-16"
    >
      <h1 className="text-2xl font-display font-semibold mb-1 dark:text-sand">Welcome back</h1>
      <p className="text-ink/60 dark:text-sand/60 mb-6 text-sm">Sign in to manage your bookings.</p>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm text-ink/70 dark:text-sand/70 block mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border border-sage dark:border-slate-700 dark:bg-slate-800 dark:text-sand rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral transition-colors"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm text-ink/70 dark:text-sand/70 block mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border border-sage dark:border-slate-700 dark:bg-slate-800 dark:text-sand rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral transition-colors"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal hover:bg-teal-light text-sand rounded-md py-2.5 font-medium transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </motion.button>
      </form>

      <p className="text-sm text-ink/60 dark:text-sand/60 mt-4 text-center">
        New here?{" "}
        <Link to="/signup" className="text-coral hover:text-coral-dark underline transition-colors">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
