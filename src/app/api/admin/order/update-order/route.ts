import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import Order from "@/src/models/order";


export const dynamic = "force-dynamic";



export async function PUT(req: Request) {


    try {
        await connectToDB();
        const data = await req.json();
        const isAuthUser = await AuthUser(req); // Placeholder for authentication logic

        if (isAuthUser?.role === "admin") {
            const {
                _id,
                orderItems,
                shippingAddress,
                paymentMethod,
                isPaid,
                paidAt,
                isProcessing
            } = data;

            if(!_id){
                return NextResponse.json({
                    success: false,
                    message: "No order found"
                });
            }

            const updateOrderStatus = await Order.findByIdAndUpdate(
                 _id,
                {
                    shippingAddress,
                    orderItems,
                    paymentMethod,
                    isPaid,
                    paidAt,
                    isProcessing,
                },
                { new: true }
            );

            if (updateOrderStatus) {
                return NextResponse.json({
                    success: true,
                    message: "Order status updated successfully.",
                    data: updateOrderStatus,
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Order not found or update failed."
                }, { status: 404 });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action."
            });
        }

    } catch (e) {
        console.log("Update order error", e);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again."
        })
    }




}

