
import  connectToDB  from "@/src/lib/db";
import Product from "@/src/models/product";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic"

export async function GET(req: Request){
      
    try{
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const getData = await Product.find({category: id});

        if (getData) {
            return NextResponse.json({
                success: true,
                data: getData
            });
        }else{
            return NextResponse.json({
                success: false,
                message: "No product found"
            });
        }
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Try again later."
        });
    }
}