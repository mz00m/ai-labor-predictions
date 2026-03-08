"use client";

import { useState, FormEvent } from "react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Wire up to your preferred backend (Formspree, Resend, etc.)
    setSubmitted(true);
  }

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          Get Started
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Tell us about your data
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Describe your project and we&apos;ll get back to you within 24 hours
          with a scope estimate.
        </p>

        {submitted ? (
          <div className="mt-12 rounded-xl border border-brand-600/50 bg-brand-600/10 p-8 text-center">
            <h3 className="text-lg font-semibold text-brand-400">
              Message received
            </h3>
            <p className="mt-2 text-gray-400">
              We&apos;ll review your project details and respond within 24
              hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 transition focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 transition focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  placeholder="you@organization.org"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="org"
                className="block text-sm font-medium text-gray-300"
              >
                Organization
              </label>
              <input
                type="text"
                id="org"
                name="org"
                className="mt-2 block w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 transition focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                placeholder="Your organization (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-300"
              >
                Budget range
              </label>
              <select
                id="budget"
                name="budget"
                className="mt-2 block w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white transition focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              >
                <option value="">Select a range</option>
                <option value="starter">$5,000 - $8,000</option>
                <option value="standard">$8,000 - $15,000</option>
                <option value="premium">$15,000 - $25,000</option>
                <option value="custom">$25,000+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300"
              >
                Project description
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-2 block w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-600 transition focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                placeholder="What data do you want to visualize? What story should it tell? Who is the audience?"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 px-8 py-3 text-base font-medium text-white transition hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/25 sm:w-auto"
            >
              Send Project Brief
            </button>
          </form>
        )}

        {/* Stripe payment link placeholder */}
        <div className="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
          <p className="text-sm text-gray-400">
            Ready to start immediately?
          </p>
          <a
            href="https://buy.stripe.com/YOUR_PAYMENT_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg border border-brand-600 px-6 py-2.5 text-sm font-medium text-brand-400 transition hover:bg-brand-600/10"
          >
            Pay deposit via Stripe ($2,500)
          </a>
          <p className="mt-2 text-xs text-gray-600">
            $2,500 deposit secures your project slot. Balance due on delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
