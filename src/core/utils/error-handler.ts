import toast from "react-hot-toast";

/**
 * Extract a human-readable message from an error object.
 * Handles ApiClientError, AxiosError, and standard Error.
 */
/**
 * Extract a human-readable message from an error object.
 * Handles ApiClientError, AxiosError, and standard Error.
 */
export const getErrorMessage = (err: unknown): string => {
  interface ErrorShape {
    message?: string;
    errors?: Array<{ message?: string }>;
    response?: { data?: { message?: string } };
  }
  const potentialErr = err as ErrorShape;

  // If there are detailed validation errors, return the first validation error's message
  if (potentialErr?.errors && Array.isArray(potentialErr.errors) && potentialErr.errors.length > 0) {
    const firstErr = potentialErr.errors[0];
    if (firstErr && typeof firstErr.message === "string") {
      return firstErr.message;
    }
  }

  // If it's our custom ApiClientError
  if (potentialErr?.message && typeof potentialErr.message === "string") {
    return potentialErr.message;
  }
  
  // Axios response error
  if (potentialErr?.response?.data?.message) {
    return potentialErr.response.data.message;
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
export const handleError = (err: unknown, fallback?: string) => {
  const message = getErrorMessage(err) || fallback || "Action failed";
  toast.error(message);
  return message;
};
