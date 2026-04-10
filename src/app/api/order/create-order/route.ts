

import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import { NextResponse } from "next/server";
import Order from "@/src/models/order";
import Cart from "@/src/models/cart";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDB();

    // Hent dataen FØRST (så vi undgår 'body already read' fejl senere)
    const data = await req.json();
    console.log("Modtaget data i API: ", data);

    const isAuthUser = await AuthUser(req);
    console.log("AuthUser result:", isAuthUser);

    // Her finder vi dit userID
    const extractedUserID = isAuthUser?.userID || isAuthUser?.id || isAuthUser?._id || isAuthUser?.user?.id || isAuthUser?.user?._id;

    if (isAuthUser && extractedUserID) {
      // 1. Tjek om alle påkrævede felter er i 'data' (shippingAddress, totalPrice, etc.)
      // 2. Opret ordren
      const saveNewOrder = await Order.create({
        ...data,
        user: extractedUserID,
        // Sørg for at totalPrice er stavet rigtigt her, hvis du rettede det i din model!
      });
      console.log("Oprettet ordre:", saveNewOrder);

      if (saveNewOrder) {
        // Ryd kurven for den pågældende bruger
        await Cart.deleteMany({ user: extractedUserID });

        return NextResponse.json({
          success: true,
          message: "Products are on the way!",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to create an order!",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e: any) {
    console.error("SERVER SIDE ERROR:", e); // SE HER I DIN TERMINAL
    return NextResponse.json({
      success: false,
      message: e.message || "Something went wrong!",
    });
  }
}