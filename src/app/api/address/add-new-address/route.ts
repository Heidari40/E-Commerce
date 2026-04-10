
import connectToDB from "@/src/lib/db";
import AuthUser from "@/src/middleware/AuthUser";
import Joi from "joi";
import { NextResponse } from "next/server";
import Address from "@/src/models/address";

const AddnewAddress = Joi.object({
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    userID: Joi.string().required(),
})

export const dynamic = "force-dynamic"



export async function POST(req: Request) {

    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);

        if (isAuthUser) {
            const data = await req.json();
             
            const { fullName, address, city, country, postalCode, userID } = data;

            const { error } = AddnewAddress.validate({
                fullName,
                address,
                city,
                country,
                postalCode,
                userID
            });

            if(error){
              return NextResponse.json(
                {
                success: false,
                message: error.message
              },
              { status: 400 }
              );
            }

            const newlyAddedAddress = await Address.create({
                fullName,
                address,
                city,
                country,
                postalCode,
                userID
            });

            if (newlyAddedAddress) {
                return NextResponse.json({
                 success: true,
                 message: "Address added successfully",
                 address: newlyAddedAddress,
                }, 
                {
                    status: 201
                }
                )
            }else{
                return NextResponse.json({
                    success: false,
                    message: "failed to add an adress! please try agin later"
                })
            }


        }else{
            return NextResponse.json({
                successe: false,
                message: "You are not authorized to perform this action"
            })
        }


    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })
     }

}