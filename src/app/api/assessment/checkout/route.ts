import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { assessmentId, email, addOn } = await req.json();

    if (!assessmentId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isAddOn = addOn === "policy-prompts";
    const amount = isAddOn ? 10000 : 10000; // $100.00 in cents
    const description = isAddOn
      ? "AI Prompts & Guidelines Add-on"
      : "Your AI Action Plan - Full Report";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description,
              description: isAddOn
                ? "Ready-to-use prompts and AI guidelines tailored to your actual workflows"
                : "Personalized AI action plan with task-by-task analysis, tool recommendations, and step-by-step roadmap",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jobsdata.ai"}/assessment/report?id=${assessmentId}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jobsdata.ai"}/assessment/report?id=${assessmentId}&payment=cancelled`,
      metadata: {
        assessmentId,
        type: isAddOn ? "addon" : "assessment",
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
