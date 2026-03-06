import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/db";
import Product from "@/src/models/product";


export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("id");


        if (!productId) {
            return NextResponse.json({
                success: false,
                status: 400,
                message: "No product found"
            });
        }
    
        const getData = await Product.findById({_id: productId});

        if (getData) {
            return NextResponse.json({
                success: true,
                data: getData
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "No product found"
            });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Try again later."
        });
    }



}