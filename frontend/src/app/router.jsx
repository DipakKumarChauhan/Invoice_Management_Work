import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import InvoiceDetails from "../pages/InvoiceDetails/InvoiceDetails";
import Login from "../pages/Login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/invoices/:id",
    element: (
      <AppLayout>
        <InvoiceDetails />
      </AppLayout>
    )
  }
]);