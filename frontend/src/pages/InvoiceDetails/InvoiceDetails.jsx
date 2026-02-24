import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInvoice } from "../../hooks/useInvoice";
import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import LineItemsTable from "../../components/invoice/LineItemsTable";
import TotalsCard from "../../components/invoice/TotalsCard";
import PaymentsSummary from "../../components/invoice/PaymentsSummary";
import Skeleton from "../../components/ui/Skeleton";

export default function InvoiceDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useInvoice(id);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-80 w-full" />
      </motion.div>
    );
  }
  if (error) return <p>Error loading invoice</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >

      <InvoiceHeader invoice={data} />

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT SIDE */}
        <div className="col-span-12 lg:col-span-8">
          <LineItemsTable lines={data.lines} />
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <TotalsCard totals={data.totals} />
          <PaymentsSummary payments={data.payments} />
        </div>

      </div>

    </motion.div>
  );
}