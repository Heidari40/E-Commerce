

import Joi from 'joi';
import { NextResponse } from 'next/server';
import User from "@/src/models/Users"
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDB from '@/src/lib/db';

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),

});

export const dynamic = "force-dynamic"

export async function POST(req: Request){
    await connectToDB();

    const {email, password} = await req.json();

    const {error} = schema.validate({email, password});

    if(error){
        return NextResponse.json({
           success: false,
           message: error.details[0].message
        });
    }

    try{
        const checkUser = await User.findOne({email});

        if(!checkUser){
            return NextResponse.json({
                success: false,
                message: "User already exists"
            })
        }

        const checkPassword = await compare(password, checkUser.password);
        console.log(checkUser, password);
        if(!checkPassword){
            return NextResponse.json({
                success: false,
                message: "Incorrect password. Please try agin!",
            })
        }
        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser?.email,
            role: checkUser?.role,
        },
        "default_secret_key",
        {expiresIn: "1d"}
    );

    const finalData = {
        token,
        user:{
            email: checkUser.email,
            role: checkUser.role,
            _id: checkUser._id,
            rol: checkUser.rol,
        },
    };
    return NextResponse.json({
        success: true,
        message: "User logged in successfully",
        finalData,
    })
    
    }catch (error){
        console.log("Error while logging in. Pleas try agin");
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        })
    }
}