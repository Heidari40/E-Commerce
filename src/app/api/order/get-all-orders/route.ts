import connectToDB from "@/src/lib/db";
import { NextResponse } from "next/server";
import AuthUser from "@/src/middleware/AuthUser";
import Order from "@/src/models/order";
import Product from "@/src/models/product";


export const dynamic = "force-dynamic";


export async function GET(req: Request) {

    try {

        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated."
            });
        }


        const isAuthUser = await AuthUser(req);
        console.log("AuthUser result in get all orders API:", isAuthUser);

        if (isAuthUser) {
            const extractAllOrders = await Order.find({ user: id }).populate(
                {
                    path: "orderItems.product",
                    model: Product,
                }
            );

            // Tilføj denne linje for at tjekke indholdet:
            console.log("Første ordre i listen:", JSON.stringify(extractAllOrders[0], null, 2));



            if (extractAllOrders && extractAllOrders.length > 0) {
                return NextResponse.json({
                    success: true,
                    message: "Orders fetched successfully.",
                    data: extractAllOrders
                });
            } else {
                return NextResponse.json({
                    success: true, // Changed to true, as no orders is a valid state
                    message: "No orders found for this user.",
                    data: [] // Return an empty array
                });


            }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action."
            })
        }



    } catch (error: any) {
        console.error("SERVER SIDE ERROR in get all orders API:", error);

        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later.", error: error.message
        })

    }

}