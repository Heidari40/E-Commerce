import connectToDB from "@/src/lib/db";
import { NextResponse } from "next/server";
import Address from "@/src/models/address";
import AuthUser from "@/src/middleware/AuthUser";

export const dynamic = "force-dynamic";


export async function GET(req: Request) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "You are not logged in!"
            })

        }
        const isAthUser = await AuthUser(req);

        if (isAthUser) {
            const getAllAddress = await Address.find({ userID: id });

            if (getAllAddress) {
                return NextResponse.json({
                    success: true,
                    data: getAllAddress
                })
            } else {
                return NextResponse.json({
                    success: false,
                    message: "No address found"
                })
            }


        }else{
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action"
            })
        }
    }catch (error) {
    console.log();
    (error)
    return NextResponse.json({
        success: false,
        message: "Somting went wrong! Please try agin later."
    })

}


} 


        
