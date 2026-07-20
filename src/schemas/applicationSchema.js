import { z } from "zod";

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  source: z.enum(["LinkedIn", "Bdjobs", "Indeed", "Wellfound", "Facebook", "Referral", "Other"]),
  status: z.enum(["Saved", "Applied", "Assessment", "Interview", "Rejected", "Offer"]),
  applicationDate: z.string().min(1, "Application date is required"),
  notes: z.string().optional(),
});