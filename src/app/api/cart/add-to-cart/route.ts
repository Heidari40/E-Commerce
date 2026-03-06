import connectToDB from "@/src/lib/db";
import Joi from "joi";
import AuthUser from "@/src/middleware/AuthUser";
import { NextResponse } from "next/server";
import Cart from "@/src/models/cart";

const AddToCart = Joi.object({
    userID: Joi.string().required(),
    productID: Joi.string().required(),
    quantity: Joi.number().required()
})

export const dynamic = "force-dynamic";


export async function POST(req: Request) {

    try {
        await connectToDB();
        const authUser = await AuthUser(req);
       
        if (authUser) {
            const data = await req.json();
            const { productID, userID, quantity } = data;

            const { error } = AddToCart.validate(data);

            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message
                })
            }

            const isCurrentCarItemAlreadyExists = await Cart.findOne({
                productID: productID,
                userID: userID
            });

            if (isCurrentCarItemAlreadyExists?.length > 0) {
                return NextResponse.json({
                    success: false,
                    message:
                        "Product is already added in cart! Please add different product"
                })
            }
            const saveProductToCart = await Cart.create(data);

            if (saveProductToCart) {
                return NextResponse.json({
                    success: true,
                    message: "Product added to cart successfully"
                })
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Something went wrong! Please try again later"
                })
            }
        }else{
            return NextResponse.json({
                success: false,
                message: "You are not authenticated",
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later"
        })
    }

}