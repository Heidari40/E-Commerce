
import AuthUser from "@/src/middleware/AuthUser";
import { NextResponse } from "next/server";


// Tjek om STRIPE_SECRET_KEY er defineret, før Stripe initialiseres
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY er ikke defineret i miljøvariablerne.");
}
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Brug en miljøvariabel til URL'en, eller fallback til en tom streng (håndteres i session)
const YOUR_DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function POST (req: Request){
    try
    {
       const isAuthUser = await AuthUser(req);
       if (!isAuthUser){
        return NextResponse.json({
            success: false,
            message: "You are not authorized to perform this action."
        })

       }

        const res = await req.json();

        // Find URL'en dynamisk fra requesten så det virker på både Vercel og lokalt
        const origin = req.headers.get('origin');

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: res,
            mode: "payment",
            success_url: `${origin}/checkout?status=success`,
            cancel_url: `${origin}/checkout?status=cancel`,
        })
    
        return NextResponse.json({
            success: true,
            id: session.id,
            url: session.url,
        })

    }catch (error){
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong."
        })
    
    }
}