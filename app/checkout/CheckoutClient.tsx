"use client";

import { ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";

export function CheckoutClient() {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (paying) return;
    setPaying(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/phonepe/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          amount: data.get("amount"),
        }),
      });
      const result = await response.json() as { ok?: boolean; redirectUrl?: string; error?: string };
      if (!response.ok || !result.ok || !result.redirectUrl) throw new Error(result.error || "Payment could not be prepared.");
      window.location.assign(result.redirectUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Payment could not be prepared.");
      setPaying(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Sanjit Chakrabarti home">
          <span className={styles.brandMark} aria-hidden="true">SC</span>
          <span>Sanjit Chakrabarti</span>
        </Link>
        <div className={styles.secure}><LockKeyhole size={15} /> Secure payment</div>
      </header>

      <section className={styles.shell}>
        <aside className={styles.summary}>
          <span className={styles.eyebrow}>Payment to</span>
          <h1>paying to Sanjit Chakrabarti</h1>
          <p>Enter your details and the amount you want to pay. You will complete the payment securely on PhonePe.</p>
          <div className={styles.assurances}>
            <div><ShieldCheck size={20} /><span><strong>Protected checkout</strong><small>Payment details stay with PhonePe</small></span></div>
            <div><Check size={20} /><span><strong>Any amount</strong><small>Choose the exact amount you need to pay</small></span></div>
          </div>
        </aside>

        <div className={styles.card}>
          <div className={styles.cardHeading}>
            <span>Payment details</span>
            <small>INR</small>
          </div>
          <form onSubmit={submit} className={styles.form}>
            <label><span>Full name</span><input name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your full name" required /></label>
            <label><span>Email address</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></label>
            <label><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="+91 98765 43210" required /></label>
            <label className={styles.amountLabel}><span>Amount</span><div className={styles.amountField}><b>₹</b><input name="amount" type="number" inputMode="decimal" min="1" max="10000000" step="0.01" placeholder="0.00" aria-label="Amount in Indian rupees" required /></div><small>Minimum ₹1</small></label>
            <button type="submit" disabled={paying}>{paying ? "Opening PhonePe…" : <>Continue with PhonePe <ArrowRight size={19} /></>}</button>
            {error ? <p className={styles.error} role="alert">{error}</p> : null}
          </form>
          <div className={styles.provider}><span className={styles.phonepeMark}>पे</span><span>Payments powered by <strong>PhonePe</strong></span></div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Sanjit Chakrabarti never sees or stores your card, bank, or UPI credentials.</p>
        <a href="mailto:sanjit@sanjitchakrabarti.com">Need help? sanjit@sanjitchakrabarti.com</a>
      </footer>
    </main>
  );
}
