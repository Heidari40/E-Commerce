'use client'

import { registrationFormControls } from "@/src/utils";
import InputComponent from "@/src/components/CommonModel/FormElements/InputComponent";
import SelectComponent from "@/src/components/CommonModel/FormElements/SelectComponent";
import { useState, useEffect } from "react";
import { registerNewUser } from "../../services/auth/register/register";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/src/context";
import { toast } from "react-hot-toast";


const initialFormData = {
    name: "",
    email: "",
    password: "",
    role: "customer",
};

type FormFieldKey = "name" | "email" | "password" | "role";

export default function Register() {
    const [formData, setFormData] = useState(initialFormData);
    const [isRegistered, setIsRegistered] = useState(false);
    const { pageLevelLoader,
        setPageLevelLoader,
        isAuthUser } = useContext(GlobalContext);
    const router = useRouter();

    console.log(formData);

    function isFormValid() {
        return (
            formData && formData.name && formData.name.trim() !== "" &&
                formData.email && formData.email.trim() !== "" &&
                // formData.password && formData.password.trim().length >= 6 && => skriver i handleRegisterOnSubmit
                formData.role && formData.role.trim() !== ""
                ? true : false

        )
    }

    async function handleRegisterOnSubmit() {
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return;
        }
        const data = await registerNewUser(formData);

        if (data?.success) {
            toast.success(data.message);
            setIsRegistered(true);
            setFormData(initialFormData);
            setPageLevelLoader(false);
        }
        else {
            toast.error(data.message);
            setPageLevelLoader(false);
            setIsRegistered(false);
            setFormData(initialFormData)
        }
    }


    useEffect(() => {
        if (isAuthUser) router.push("/");
    }, [isAuthUser])



    return (
        <div className="bg-white ">
            <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
                <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
                    <div className="w-full mt-0 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-15 ">
                        <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                            <p className="w-full text-4xl font-medium text-center font-serif cursor-pointer ">
                                {isRegistered
                                
                                    ? "Registration Successful !"
                                    : "Sign up for an account"}
                            </p>
                            {isRegistered ? (
                                <button
                                    onClick={() => router.push("/login")}
                                    className="inline-flex w-full items-center justify-center bg-black px-6 py-4
                                                    text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium
                                                    uppercase tracking-wide">
                                    Login
                                </button>



                            ) : (

                                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">

                                    {
                                        registrationFormControls.map((controlItem) =>
                                            controlItem.componentType === "input" ? (
                                                <InputComponent

                                                    type={controlItem.type}
                                                    placeholder={controlItem.placeholder}
                                                    label={controlItem.label}
                                                    key={controlItem.id}
                                                    value={formData[controlItem.id as FormFieldKey]}
                                                    onChange={(event) => {
                                                        setFormData({
                                                            ...formData,
                                                            [controlItem.id]: event.target.value,
                                                        });
                                                    }}
                                                />


                                            ) : controlItem.componentType === "select" ? (
                                                <SelectComponent
                                                    options={controlItem.options}
                                                    label={controlItem.label}
                                                    key={controlItem.id}
                                                    value={formData[controlItem.id as FormFieldKey]}
                                                    onChange={(event) =>
                                                         { setFormData({ 
                                                            ...formData,
                                                             [controlItem.id]: event.target.value 
                                                            }) }}
                                                />
                                            ) : null
                                        )}
                                    <button
                                        className="inline-flex w-full items-center justify-center bg-black px-6 py-4
                                                    text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium
                                                    uppercase tracking-wide rounded-md cursor-pointer hover:bg-gray-600 transition-100"
                                        disabled={!isFormValid()}
                                        onClick={handleRegisterOnSubmit}
                                    >
                                        Register
                                    </button>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}