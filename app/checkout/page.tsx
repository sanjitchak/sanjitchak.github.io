import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: { absolute: "Paying to Sanjit Chakrabarti" },
  description: "Securely pay any amount to Sanjit Chakrabarti using PhonePe.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
