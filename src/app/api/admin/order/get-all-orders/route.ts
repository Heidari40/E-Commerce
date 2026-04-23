import connectToDB from "@/src/lib/db";
import { NextResponse } from "next/server";
import AuthUser from "@/src/middleware/AuthUser";
import Order from "@/src/models/order";
import Products from "@/src/models/product";
import User from "@/src/models/Users";



export const dynamic = "force-dynamic";

export async function GET(req: Request) {

    try {


        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === "admin") {
            const getAllOrdersForAllUsers = await Order.find()
                .populate({
                    path: "user",
                    model: User,
                    select: "_id name email"
                })
                .populate({
                    path: "orderItems.product",
                    model: Products,
                    select: "_id name price  "

                });

            if (getAllOrdersForAllUsers) {
                return NextResponse.json({
                    success: true,
                    data: getAllOrdersForAllUsers
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "No orders found."
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action."
            });

        }

    } catch (e) {
        console.log(e, "Debug Backend")
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again."
        })
    }




}