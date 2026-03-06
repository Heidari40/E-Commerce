import Product from "@/src/models/product";
import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === "admin") {

            const extractData = await req.json();
            const {
                _id,
                name,
                price,
                description,
                category,
                deliveryInfo,
                onSale,
                priceDrop,
                sizes,
                imageUrl
            } = extractData;

            const updateProduct = await Product.findByIdAndUpdate({
                _id: _id
            }
                , {
                    name,
                    price,
                    description,
                    category,
                    deliveryInfo,
                    onSale,
                    priceDrop,
                    sizes,
                    imageUrl
                },
                {
                    new: true
                }
            );
            if (updateProduct) {
                return NextResponse.json({
                    success: true,
                    message: "Product updated successfully"
                });
            }
            return NextResponse.json({
                success: false,
                message: "Product not updated! Try again later."
            })

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action."
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