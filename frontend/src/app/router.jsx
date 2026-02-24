import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateInvoice from "../pages/CreateInvoice/CreateInvoice";
import Dashboard from "../pages/Dashboard/Dashboard";
import InvoiceDetails from "../pages/InvoiceDetails/InvoiceDetails";
import Login from "../pages/Login/Login";
import EditInvoice from "../pages/EditInvoice/EditInvoice";
import Register from "../pages/Login/Register";
import Home from "../pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: "/invoices/new",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <CreateInvoice />
        </AppLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: "/invoices/:id",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <InvoiceDetails />
        </AppLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: "/invoices/:id/edit",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <EditInvoice />
        </AppLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />
  }
]);