import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import Address from "@/src/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
    try {
        await connectToDB();
        const isAthUser = await AuthUser(req);

        if (!isAthUser) {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }
            const data = await req.json();
            const { _id, fullName, city, address, country, postalCode } = data;

            if(!_id){
                return NextResponse.json({
                    success: false,
                    message: "_id fields are required"
                })
            }


            
            const updatAddress = await Address.findByIdAndUpdate(

                _id,

                {
                    fullName, city, address, country, postalCode
                },
                { new: true  }
            );
            if (updatAddress) {
                return NextResponse.json({
                    success: true,
                    message: "Address updated successfully"
                })
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to update address! Please try again later"
                })
            }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })

    }

}