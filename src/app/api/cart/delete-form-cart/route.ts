

import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import Cart from "@/src/models/cart";
import { exp } from "firebase/firestore/pipelines";


export const dynamic = "force-dynamic";




export async function DELETE(req: Request) {
    try {


        await connectToDB();
        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            if (!id)
                return NextResponse.json({
                    success: false,
                    message: "Product ID not found"
                });

            const deleteCartItems = await Cart.findByIdAndDelete(id);
            if (deleteCartItems) {
                return NextResponse.json({
                    success: true,
                    message: "Cart item deleted successfully"
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Something went wrong! Please try again later"
                });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated"
            });

        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            sucess: false,
            message: "Something went wrong! Please try again later"
        })
    }
}
