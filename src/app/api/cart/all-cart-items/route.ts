
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import { NextResponse } from "next/server";
import Cart from "@/src/models/cart";




export const dynamic = "force-dynamic";


export async function GET(req: Request) {
    try {

        await connectToDB();
        const isAuthuser = await AuthUser(req);
        // console.log("Token:", req.headers.get("Authorization"))

        if (!isAuthuser) {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated"
            });

        }
      
        const { searchParams } = new URL(req.url);
        const Id = searchParams.get("id");

        if (!Id) {
            return NextResponse.json({
                success: false,
                message: "User ID not found"
            });
        }

        // - populate fortæller Mongoose:
        // - “Gå ud og hent det fulde dokument, som productID peger på.”
        
        const extractAllCartItems = await Cart.find({ userID: Id }).populate("productID");

            return NextResponse.json({
            success: true,
            data: extractAllCartItems
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later"
        })
    }

}