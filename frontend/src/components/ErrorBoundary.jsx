import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "Please try again.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data || "Page not found.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
