
import { NextResponse } from "next/server"
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import Order from "@/src/models/order";
import Product from "@/src/models/product";

export const dynamic = "force-dynamic";


export async function GET(req: Request){

    try{

        await connectToDB();

        const isAuthUser = await AuthUser(req);
        console.log("AuthUser result in get all orders API:", isAuthUser);


        if (isAuthUser){
            const {searchParams} = new URL(req.url);
            const id = searchParams.get("id");

            console.log(id,"det er ID console loggg")

            if (!id) {
                return NextResponse.json({
                    success: false,
                    message: "Order ID is required."
                });
            }


            const extractOrderDetails = await Order.findById(id).populate(
                {
                    path: "orderItems.product",
                    model: Product,
                    select: "name price imageUrl email"
     
                }
            )
            if(extractOrderDetails){
                return NextResponse.json({
                    success: true,
                    data: extractOrderDetails
                })
            }else{
                return NextResponse.json({
                    success: false,
                    message: "Faild to get order details."
                })
            }

        }else{
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action."
            })
        }


    }catch(e){
        return NextResponse.json({
            success: false,
            message: "Somthing went wrong! Please try agin."
        })
    }
}