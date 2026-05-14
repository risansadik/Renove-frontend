import toast from "react-hot-toast";

/**
 * Extract a human-readable message from an error object.
 * Handles ApiClientError, AxiosError, and standard Error.
 */
export const getErrorMessage = (err: any): string => {
  // If it's our custom ApiClientError
  if (err?.message && typeof err.message === "string") {
    return err.message;
  }
  
  // Axios response error
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  // Standard Error object
  if (err instanceof Error) {
    return err.message;
  }

  // Fallback
  return "An unexpected error occurred. Please try again.";
};

/**
 * Unified error handler that shows a toast and returns the message string.
 * Useful for both form field errors and global notifications.
 */
export const handleError = (err: any, fallback?: string) => {
  const message = getErrorMessage(err) || fallback || "Action failed";
  toast.error(message);
  return message;
};
