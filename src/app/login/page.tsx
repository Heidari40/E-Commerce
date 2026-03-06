'use client'

import { loginFormControls } from "@/src/utils";
import InputComponent from "@/src/components/CommonModel/FormElements/InputComponent";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { login } from "@/src/services/auth/login/login";
import { GlobalContext } from "@/src/context";
import Cookies from "js-cookie";
import toast from "react-hot-toast";


const isRegistered = false;

const initialFormdata = {
    email: "",
    password: "",
};

type FormFieldKey = "email" | "password";





export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormdata);
    const {
         isAuthUser, 
         setIsAuthedUser, 
         user, 
         setUser, 
         componentLevelLoader, 
         setComponentLevelLoader
         } = useContext(GlobalContext);


    function isValidForm() {
        return formData && formData.email && formData.email.trim() !== ""
            && formData.password && formData.password.trim() !== ""
            ? true : false;
    }
    async function handleLogin() {
        const res = await login(formData);
        console.log(res);

        if (res.success) {
            setIsAuthedUser(true);
            setUser(res?.finalData?.user) //finalData er i login router.ts 
            setFormData(initialFormdata)  // Den resetter din form til startværdierne.
            Cookies.set('token', res?.finalData.token) //Den gemmer login‑tokenen, så brugeren forbliver logget ind.
            localStorage.setItem('user', JSON.stringify(res?.finalData?.user))   // ✔️ Gemmer brugerens data i browseren
                                                                                // ✔️ Konverterer objekt → string
                                                                               // ✔️ Sørger for at data stadig findes efter reloa
            setComponentLevelLoader({ loading: false, id: "" });

        } else {
            setIsAuthedUser(false);
            toast.error("This email could not be found. Please register.",res.message);
            setFormData(initialFormdata);
            setComponentLevelLoader({ loading: false, id: "" });
        }
    }

     console.log(isAuthUser, user)

      useEffect(() => {
            if (isAuthUser) router.push("/");
        }, [isAuthUser])

    return (
        <div className="bg-white ">
            <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
                <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
                    <div className="w-full mt-0 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-15 ">
                        <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                            <p className="w-full text-4xl font-medium text-center font-serif ">
                                {isRegistered
                                    ? "Registration Successful !"
                                    : "Sign up for an account"}
                            </p>
                            {isRegistered ? (
                                <button className="inline-flex w-full items-center justify-center bg-black px-6 py-4
                                                    text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium 
                                                    uppercase tracking-wide">
                                    Login
                                </button>

                            ) : (

                                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                                    {
                                        loginFormControls.map((controlItem) =>
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

                                            ) : null
                                        )}
                                    <button
                                        className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4
                                                    text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium 
                                                    uppercase tracking-wide rounded-md cursor-pointer hover:bg-gray-600 transtion-100"
                                        disabled={!isValidForm()}
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </button>
                                    <div className="flex flex-col gap-2">
                                        <p>
                                            New to website?
                                        </p>
                                        <button
                                            className="inline-flex w-full items-center justify-center bg-black px-6 py-4
                                                    text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium 
                                                    uppercase tracking-wide rounded-md cursor-pointer hover:bg-gray-600 transtion-100"
                                            onClick={() => router.push("./register")}
                                        >
                                            Register
                                        </button>
                                    </div>
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
