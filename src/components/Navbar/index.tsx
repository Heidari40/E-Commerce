'use client';

import { Fragment, use, useContext } from "react";
import { adminNavOptions } from "@/src/utils";
import { navOptions } from "@/src/utils";
import { GlobalContext } from "@/src/context";
import CommonModel from "../CommonModel";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { NavStyles } from "@/src/utils";
import { useEffect } from "react";
import CartModel from "../CartModal";


type NavItemsProps = {
    isModalView?: boolean;
    isAdminView?: boolean;
    router: any;
}


function NavItems({ isModalView = false, isAdminView, router }: NavItemsProps) {
   
    return (
        <div className={`items-center justify-between w-full lg:flex lg:w-auto
             ${isModalView ? "" : "hidden"}`}id="nav-items"
        >

            <ul
                className={`flex flex-col md:p-0 mt-0 font-medium gap-9 lg:flex-row lg:space-x-8
                ${isModalView ? "border-none" : ""}`}

            >

                {isAdminView ? adminNavOptions.map((item) => (
                    <li className="cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:p-0 text-xs"
                        key={item.id}
                        onClick={() => router.push(item.path)}
                    >
                        {item.label}
                    </li>
                ))
                    : navOptions.map((item) => (
                        <li
                            className="cursor-pointer block py-2 pl-3 pr-4 text-sm text-gray-900 rounded md:p-0"
                            key={item.id}
                            onClick={() => router.push(item.path)}
                        >
                            {item.label}
                        </li>
                    ))}
            </ul>
        </div>
    )

}


export default function Navbar() {
    const { showNavModel, setShowNavModel } = useContext(GlobalContext);
    const { user, setUser, isAuthUser, setIsAuthedUser,
         currentUpdatedProduct, setCurrentUpdatedProduct, showCartModel, setShowCartModel} = useContext(GlobalContext);
    const router = useRouter();

    //usePathname er en hook fra Next.js, der giver dig den aktuelle URL‑sti i browseren. /localhost:3000/admin-view
    const pathName = usePathname();

   
    function handleLogout() {
        setIsAuthedUser(false);
        setUser(null);
        Cookies.remove("token");
        localStorage.clear();
        router.push("/");
    }

    useEffect(() => {
        if(pathName !== "/admin-view/add-product" && currentUpdatedProduct !== null) setCurrentUpdatedProduct(null);
    }, [pathName])


    const isAdminView = pathName.includes("admin-view"); //adminview er true her


    return (
        <>
            <nav className="fixed relative w-full top-0 left-0 bg-white border-b border-gray-200  ">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto my-4 px-4 sm:px-6 lg:px-8">
                    <div onClick={() => router.push("/")} className="flex items-center cursor-pointer">
                        <span className=" self-center text-2xl font-semibold whitespace-nowrap border px-2 ">
                            E-Webshop
                        </span>
                    </div>
                    <div className="flex md:order-2 gap-4 cursor-pointer">
                        {
                            !isAdminView && isAuthUser ? (
                                <Fragment>
                                    <button onClick={() => router.push("/account")}
                                   className={NavStyles}>
                                    Account
                                    </button>
                                    <button onClick={() => setShowCartModel(true)}
                                     className={NavStyles}>
                                        Cart
                                        </button>
                                </Fragment>
                            ) : null}
                        {user?.role === "admin" ? (
                            isAdminView ? (
                                <button
                                    onClick={() => router.push("/")}
                                    className={NavStyles}
                                >
                                    Client view
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push("/admin-view")}
                                    className={NavStyles}
                                >
                                    Admin view
                                </button>
                            )
                        ) : null}
                        {isAuthUser ?
                            <button
                                onClick={handleLogout}
                                className={NavStyles}
                            >Logout</button>
                            : <button
                                onClick={() => router.push("/login")}
                                className={NavStyles}>
                                Login
                            </button>}

                        <button
                            data-collapse-toggle="navbar-sticky"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-items"
                            aria-expanded="false"
                            onClick={() => setShowNavModel(true)}
                        >

                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <NavItems
                        isAdminView={isAdminView}
                        isModalView={false}
                        router={router}
                    />
                </div>
            </nav>

            <CommonModel
                showModelTitle={false}
                modalTitle={"Navigation"}
                mainContent=
                {<
                    NavItems
                    router={router}
                    isModalView={true}
                    isAdminView={isAdminView}
                />}
                show={showNavModel}
                setShow={setShowNavModel}
                showbuttons={true}
                buttonComponent={null}
            />
            {showCartModel && <CartModel/>}
        </>

    )
}
