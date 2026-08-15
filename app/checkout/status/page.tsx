import type { Metadata } from "next";
import { PaymentStatusClient } from "./PaymentStatusClient";

export const metadata: Metadata = {
  title: { absolute: "Payment Status | Sanjit Chakrabarti" },
  robots: { index: false, follow: false },
};

export default function CheckoutStatusPage() {
  return <PaymentStatusClient />;
}
