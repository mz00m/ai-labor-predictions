"use client";

import { useState, FormEvent } from "react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Wire up to Formspree, Resend, or your preferred backend
    setSubmitted(true);
  }

  return (
    <section id="contact" className="relative px-6 py-28">
      {/* Soft arc at top */}
      <svg
        className="pointer-events-none absolute left-0 top-0 w-full"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 80 Q 600 0 1200 80"
          fill="none"
          stroke="rgba(20,184,166,0.06)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
          Start a <span className="font-semibold">project</span>
        </h2>
        <p className="mt-4 text-[17px] text-gray-400">
          Tell us about your data. We respond within 24 hours.
        </p>

        <div className="mt-6 h-px w-full bg-white/[0.06]" />

        {submitted ? (
          <div className="mt-12 rounded-xl border border-brand-600/20 bg-brand-600/[0.05] px-8 py-10 text-center">
            <p className="text-[17px] font-medium text-white">
              Message received.
            </p>
            <p className="mt-2 text-[15px] text-gray-400">
              We&apos;ll review your project and respond within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[13px] font-medium text-gray-500"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1.5 block w-full rounded-lg border border-white/[0.08] bg-surface-2 px-4 py-2.5 text-[14px] text-white placeholder-gray-600 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-medium text-gray-500"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1.5 block w-full rounded-lg border border-white/[0.08] bg-surface-2 px-4 py-2.5 text-[14px] text-white placeholder-gray-600 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="you@organization.org"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="org"
                className="block text-[13px] font-medium text-gray-500"
              >
                Organization
                <span className="ml-1 text-gray-700">(optional)</span>
              </label>
              <input
                type="text"
                id="org"
                name="org"
                className="mt-1.5 block w-full rounded-lg border border-white/[0.08] bg-surface-2 px-4 py-2.5 text-[14px] text-white placeholder-gray-600 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Your organization"
              />
            </div>

            <div>
              <label
                htmlFor="budget"
                className="block text-[13px] font-medium text-gray-500"
              >
                Budget range
              </label>
              <select
                id="budget"
                name="budget"
                className="mt-1.5 block w-full rounded-lg border border-white/[0.08] bg-surface-2 px-4 py-2.5 text-[14px] text-white transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select a range</option>
                <option value="5k">Around $5k</option>
                <option value="12k">Around $12k</option>
                <option value="20k">$20k+</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-[13px] font-medium text-gray-500"
              >
                What are you working on?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="mt-1.5 block w-full rounded-lg border border-white/[0.08] bg-surface-2 px-4 py-2.5 text-[14px] text-white placeholder-gray-600 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="What data do you want to visualize? What story should it tell? Who will see it?"
              />
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-8 py-3 text-[15px] font-medium text-white transition-all hover:bg-brand-500"
              >
                Send project brief
              </button>
              <span className="text-[13px] text-gray-600">
                or{" "}
                <a
                  href="https://buy.stripe.com/YOUR_PAYMENT_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 transition-colors hover:text-brand-300"
                >
                  pay $2,500 deposit
                </a>
                {" "}to secure your slot
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
