import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../schemas/authSchemas";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { buttonStyles } from "../components/Button";

const inputClass =
  "w-full border border-border bg-surface rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col">
      <div className="flex justify-between items-center px-6 py-5 max-w-5xl mx-auto w-full">
        <Link to="/" className="font-display font-semibold">CareerTrack Lite</Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface border border-border p-8 rounded-xl w-full max-w-sm space-y-4 animate-fade-in-up"
        >
          <h1 className="font-display text-2xl font-semibold text-center">Welcome back</h1>

          {serverError && (
            <p className="text-danger text-sm bg-danger/10 p-2.5 rounded-lg">{serverError}</p>
          )}

          <div>
            <input {...register("email")} placeholder="Email" className={inputClass} />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className={inputClass}
            />
            {errors.password && (
              <p className="text-danger text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonStyles("primary", "w-full")}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-muted">
            No account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;