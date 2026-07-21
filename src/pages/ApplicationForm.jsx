import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { applicationSchema } from "../schemas/applicationSchema";
import { createApplication, getApplicationById, updateApplication } from "../api/applicationApi";
import Navbar from "../components/Navbar";
import { buttonStyles } from "../components/Button";

const SOURCES = ["LinkedIn", "Bdjobs", "Indeed", "Wellfound", "Facebook", "Referral", "Other"];
const STATUSES = ["Saved", "Applied", "Assessment", "Interview", "Rejected", "Offer"];

const inputClass =
  "w-full border border-border bg-surface rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const ApplicationForm = () => {
  const { id } = useParams();
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
      companyName: "", jobTitle: "", jobUrl: "",
      source: "Other", status: "Saved", applicationDate: "", notes: "",
    },
  });

  useEffect(() => {
    if (!isEditMode) return;
    getApplicationById(id)
      .then((res) => {
        const app = res.data;
        reset({ ...app, applicationDate: app.applicationDate?.split("T")[0] });
      })
      .catch(() => setServerError("Could not load application"))
      .finally(() => setLoading(false));
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      if (isEditMode) await updateApplication(id, data);
      else await createApplication(data);
      navigate("/applications");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />

      <div className="max-w-xl mx-auto p-6">
        <h1 className="font-display text-2xl font-semibold mb-6">
          {isEditMode ? "Edit Application" : "Add New Application"}
        </h1>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-surface border border-border rounded-xl p-6 animate-fade-in-up"
          >
            {serverError && (
              <p className="text-danger text-sm bg-danger/10 p-2.5 rounded-lg">{serverError}</p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Company Name *</label>
              <input {...register("companyName")} className={inputClass} />
              {errors.companyName && <p className="text-danger text-xs mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input {...register("jobTitle")} className={inputClass} />
              {errors.jobTitle && <p className="text-danger text-xs mt-1">{errors.jobTitle.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Post URL</label>
              <input {...register("jobUrl")} className={inputClass} />
              {errors.jobUrl && <p className="text-danger text-xs mt-1">{errors.jobUrl.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <select {...register("source")} className={inputClass}>
                  {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select {...register("status")} className={inputClass}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Application Date *</label>
              <input type="date" {...register("applicationDate")} className={inputClass} />
              {errors.applicationDate && (
                <p className="text-danger text-xs mt-1">{errors.applicationDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea {...register("notes")} rows={3} className={inputClass} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting} className={buttonStyles("primary")}>
                {isSubmitting ? "Saving..." : isEditMode ? "Update Application" : "Add Application"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/applications")}
                className={buttonStyles("secondary")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;