import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { router } from "./app/router";
import { queryClient } from "./app/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);