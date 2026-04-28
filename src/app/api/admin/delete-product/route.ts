
import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/db";
import Product from "@/src/models/product";
import AuthUser from "@/src/middleware/AuthUser";


export const dynamic = "force-dynamic";
export const revalidate = 0

export async function DELETE(req: Request) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === "admin") {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            if (!id) 
                return NextResponse.json({
                    success: false,
                    message: "Product ID not found"
                  });

                const deletedProduct = await Product.findByIdAndDelete(id);

                  if (deletedProduct) {
                    return NextResponse.json({
                        success: true,
                        message: "Product not deleted! Try again later."
                    });
               }    
                  else {
                    return NextResponse.json({
                        success: false,
                        message: "Product not found"
                    });
                  }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action"

            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        });

    }
}