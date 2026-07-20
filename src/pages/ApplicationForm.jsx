import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { applicationSchema } from "../schemas/applicationSchema";
import {
  createApplication,
  getApplicationById,
  updateApplication,
} from "../api/applicationApi";

const SOURCES = ["LinkedIn", "Bdjobs", "Indeed", "Wellfound", "Facebook", "Referral", "Other"];
const STATUSES = ["Saved", "Applied", "Assessment", "Interview", "Rejected", "Offer"];

const ApplicationForm = () => {
  const { id } = useParams(); // URL-এ id থাকলে edit mode, না থাকলে add mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobUrl: "",
      source: "Other",
      status: "Saved",
      applicationDate: "",
      notes: "",
    },
  });

  // Edit mode হলে existing data fetch করে form pre-fill করছি
  useEffect(() => {
    if (!isEditMode) return;
    getApplicationById(id)
      .then((res) => {
        const app = res.data;
        reset({
          ...app,
          applicationDate: app.applicationDate?.split("T")[0], // ISO date কে input[type=date]-এর ফরম্যাটে আনা
        });
      })
      .catch(() => setServerError("Could not load application"))
      .finally(() => setLoading(false));
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      if (isEditMode) {
        await updateApplication(id, data);
      } else {
        await createApplication(data);
      }
      navigate("/applications");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Application" : "Add New Application"}
      </h1>

      {serverError && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name *</label>
          <input {...register("companyName")} className="w-full border rounded p-2" />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Title *</label>
          <input {...register("jobTitle")} className="w-full border rounded p-2" />
          {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Post URL</label>
          <input {...register("jobUrl")} className="w-full border rounded p-2" />
          {errors.jobUrl && <p className="text-red-500 text-sm">{errors.jobUrl.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <select {...register("source")} className="w-full border rounded p-2">
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select {...register("status")} className="w-full border rounded p-2">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Application Date *</label>
          <input type="date" {...register("applicationDate")} className="w-full border rounded p-2" />
          {errors.applicationDate && (
            <p className="text-red-500 text-sm">{errors.applicationDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea {...register("notes")} rows={3} className="w-full border rounded p-2" />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update Application" : "Add Application"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/applications")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;