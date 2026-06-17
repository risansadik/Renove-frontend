import { useState } from "react";
import toast from "react-hot-toast";
import reportService, { type ReportCategory, type CreateReportPayload } from "../../../../services/api/report.service";

export const useReportIssue = () => {
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!category) e.category = "Please select a category.";
    if (subject.trim().length < 5) e.subject = "Subject must be at least 5 characters.";
    if (description.trim().length < 10) e.description = "Description must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    const merged = [...files, ...incoming].slice(0, 5);
    setFiles(merged);
    e.target.value = "";
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setSubmitted(false);
    setCategory("");
    setSubject("");
    setDescription("");
    setFiles([]);
    setErrors({});
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: CreateReportPayload = {
        category: category as ReportCategory,
        subject: subject.trim(),
        description: description.trim(),
        attachments: files,
      };
      await reportService.createReport(payload);
      setSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch {
      // error toast handled by apiClient interceptor
    } finally {
      setLoading(false);
    }
  };

  return {
    category,
    setCategory,
    subject,
    setSubject,
    description,
    setDescription,
    files,
    loading,
    submitted,
    errors,
    setErrors,
    handleFileChange,
    removeFile,
    resetForm,
    submitForm,
  };
};