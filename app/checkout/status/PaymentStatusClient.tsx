"use client";

import { CheckCircle2, Clock3, RotateCw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "../page.module.css";

type PaymentState = "LOADING" | "PENDING" | "COMPLETED" | "FAILED" | "ERROR";

export function PaymentStatusClient() {
  const order = useMemo(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("order") || "", []);
  const [state, setState] = useState<PaymentState>("LOADING");
  const [amount, setAmount] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function check() {
    if (!order) { setState("ERROR"); setMessage("Payment reference is missing."); return; }
    setState((current) => current === "LOADING" ? "LOADING" : "PENDING");
    try {
      const response = await fetch(`/api/phonepe/status?order=${encodeURIComponent(order)}`, { cache: "no-store" });
      const result = await response.json() as { ok?: boolean; state?: PaymentState; amountPaise?: number; error?: string };
      if (!response.ok || !result.ok || !result.state) throw new Error(result.error || "Payment status could not be checked.");
      setState(result.state);
      setAmount(typeof result.amountPaise === "number" ? result.amountPaise : null);
    } catch (reason) {
      setState("ERROR");
      setMessage(reason instanceof Error ? reason.message : "Payment status could not be checked.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void check(), 0);
    return () => window.clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const details = state === "COMPLETED"
    ? { icon: <CheckCircle2 />, title: "Payment successful", copy: "Your payment to Sanjit Chakrabarti has been confirmed." }
    : state === "FAILED"
      ? { icon: <XCircle />, title: "Payment not completed", copy: "No successful payment was recorded. You can safely try again." }
      : state === "ERROR"
        ? { icon: <XCircle />, title: "We could not confirm the payment", copy: message }
        : { icon: <Clock3 />, title: "Checking your payment", copy: "This normally takes only a few seconds." };

  return <main className={styles.statusPage}>
    <a className={styles.brand} href="/checkout"><span className={styles.brandMark} aria-hidden="true">SC</span><span>Sanjit Chakrabarti</span></a>
    <section className={`${styles.statusCard} ${styles[`status${state}`]}`}>
      <div className={styles.statusIcon}>{details.icon}</div>
      <h1>{details.title}</h1>
      <p>{details.copy}</p>
      {amount !== null ? <strong className={styles.statusAmount}>₹{(amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> : null}
      {state === "PENDING" || state === "ERROR" ? <button type="button" onClick={() => void check()}><RotateCw size={17} /> Check again</button> : null}
      {state === "FAILED" ? <a className={styles.retryLink} href="/checkout">Try another payment</a> : null}
    </section>
  </main>;
}
