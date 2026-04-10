
import connectToDB from "@/src/lib/db";
import { NextResponse } from "next/server";
import AuthUser from "@/src/middleware/AuthUser";
import Address from "@/src/models/address";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request){
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if(!id){
            return NextResponse.json({
                success: false,
                message: "Address ID is required"
            })
        }
         const isAuthUser = await AuthUser(req);

            if(isAuthUser){
                const deletedAddress = await Address.findByIdAndDelete(id);

                if(deletedAddress){
                    return NextResponse.json({
                        success: true,
                        message: "Address deleted successfully",
                    });
                }

            }else{
                return NextResponse.json({
                    success: false,
                    message: "You are not authorized to perform this action"
                })}


        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })
        
    }



}