import { NextResponse } from "next/server";
import Product from "@/src/models/product";
import connectToDB from "@/src/lib/db";


export const dynamic = "force-dynamic";

export async function GET() {

    try{
        await connectToDB();

        const extractAllproducts = await Product.find({});

        if(extractAllproducts){
            return NextResponse.json({
                success: true,
                data: extractAllproducts
            })
        }
        else{
            return NextResponse.json({
                success: false,
                status: 204,
                message: "No products found"
            })
        }

    }catch(error){
        console.log(error);
        return NextResponse.json({
            success: false,
            message:"Somting went wrong! Please try again later"});
    }
}