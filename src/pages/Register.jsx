import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema } from "../schemas/authSchemas";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerUser(data.name, data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        {serverError && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{serverError}</p>
        )}

        <div>
          <input
            {...register("name")}
            placeholder="Full name"
            className="w-full border rounded p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border rounded p-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;