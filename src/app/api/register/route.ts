import Joi from "joi"
import connectToDB from "@/src/lib/db";
import User from "@/src/models/Users";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";


const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
})


export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    await connectToDB();

    const { name, email, password, role } = await req.json();
    const { error } = schema.validate({ name, email, password, role });
    const normalizedEmail = email.toLowerCase();


    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
        });
    }

    try {
        const isUserAlreadyExist = await User.findOne({ email: normalizedEmail });

        if (isUserAlreadyExist) {
            return NextResponse.json({
                success: false,
                message: "User already exist. Please try with different email.",
            });
        } else {
            const hashedPassword = await hash(password, 12);

            const newlyCreatedUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
            });

            if (newlyCreatedUser) {
                return NextResponse.json({
                    success: true,
                    message: "User created successfully",
                })
            }
        }
    } catch (error) {
        console.log("Error while new user registration. Please try again.");

        return NextResponse.json({
            success: false,
            message: "Somting went wrong! Please try again later.",
        })
    }
}
