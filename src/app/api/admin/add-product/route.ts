
import connectToDB from "@/src/lib/db";
import { NextResponse } from "next/server";
import Joi from "joi";
import Product from "@/src/models/product";
import AuthUser from "@/src/middleware/AuthUser";


// Joi tjekker, at alle disse felter findes og ikke er tomme, før API’et accepterer requesten.

const AddNewProductScema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    deliveryInfo: Joi.string().required(),
    onSale: Joi.string().required(),
    priceDrop: Joi.number().required(),
    sizes: Joi.array().required(),
    imageUrl: Joi.string().required(),

})

//Denne route må ALDRIG caches – kør den altid dynamisk på serveren.
export const dynamic = "force-dynamic"
    
export async function POST(req: Request) {
    try {

        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === 'admin') {
            const extractData = await req.json();

            const {
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

            const { error } = AddNewProductScema.validate({
                name,
                price,
                description,
                category,
                deliveryInfo,
                onSale,
                priceDrop,
                sizes,
                imageUrl

            });


            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message
                });
            }
            const newlyCreatedproduct = await Product.create(extractData)

            if (newlyCreatedproduct) {
                return NextResponse.json({
                    success: true,
                    message: "Product added successfully"
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Product not added"
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action"
            })
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        });
    }

}