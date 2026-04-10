
import { NextResponse } from "next/server"
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import Order from "@/src/models/order";

export const dynamic = "force-dynacmic"

export async function GET(req: Request){

    try{

        await connectToDB();

        const isAuthUser = await AuthUser(req);

        if (isAuthUser){
            const {searchParams} = new URL(req.url);
            const id = searchParams.get("id");
             

            const extractOrderDetails = await Order.findById(id).populate(
                "orderItems.productId"
            )
            if(extractOrderDetails){
                return NextResponse.json({
                    success: true,
                    message: "Order details fetched successfully.",
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