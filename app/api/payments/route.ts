// import { handleCheckOutSessionCompleted } from "@/lib/payments";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export const POST = async (req:  NextRequest) => {
//   const payload = await req.text();

//   const sig = req.headers.get("stripe-signature");

//   let event;

//   const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig!, endPointSecret);

//     switch (event.type) {
//       case "checkout.session.completed":
//         console.log("Checkout Session Completed!");
//         const sessionId = event.data.object.id;
//         const session = await stripe.checkout.sessions.retrieve(sessionId, {
//           expand: ["line_items"],
//         });

//         await handleCheckOutSessionCompleted({ session });

//         break;

//       case "customer.subscription.deleted":
//         console.log("Customer Subscription Deleted!");
//         const subscription = event.data.object;
//         console.log("subscription", subscription);
//         break;

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//   } catch (err) {
//     console.log(err);

//     return NextResponse.json(
//       { error: "Failed to trigger webhook", err },
//       { status: 400 }
//     );
//   }

//   return NextResponse.json({
//     status: "success",
//   });
// };

import { handleCheckOutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");
  const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig!, endPointSecret);

    switch (event.type) {
      case "checkout.session.completed":
        console.log("✅ Checkout Session Completed!");
        const sessionId = (event.data.object as Stripe.Checkout.Session).id;

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items", "customer"],
        });

        await handleCheckOutSessionCompleted({
          session,
          stripe,
        });
        break;

      case "customer.subscription.deleted":
        console.log("⚠️ Customer Subscription Deleted!");
        const subscription = event.data.object;
        const subscriptionId = event.data.object.id;
        await handleSubscriptionDeleted({
          subscriptionId,
          stripe,
        });
        console.log("Subscription:", subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error("❌ Stripe Webhook Error:", err.message);

    return NextResponse.json(
      { error: "Failed to trigger webhook", message: err.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true });
};
