import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST({ request, locals }) {
  const stripe = new Stripe(
    "sk_test_51QEn8FGvqg6VjkbsAABg1XfYdPvnSU1AKa8GkFOXXwCcd5MEW3BrMY4TSW12X7ePaSdBkiomo8lCFuH2I6a5HrAK00EwENcZHn"
  );

  try {
    const { paymentMethodId, amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:4321/payment-success",
    });
    await db
      .update(users)
      .set({ premiumUser: true })
      .where(eq(users.id, locals.user.id));
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
