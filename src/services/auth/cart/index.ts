
import Cookies from "js-cookie";


type RegisterFormDataProps = {
    userID: string;
    productID: string;
    quantity: number;
}


export const addToCart = async (formData: RegisterFormDataProps) => {
    try {
        const res = await fetch("/api/cart/add-to-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getAllCartItems = async (id: string) => {
    try {

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/cart/all-cart-items?id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,

            },
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
    }
};


export const deleteCartItem = async (id: string) => {
    try{
        const basUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${basUrl}/api/cart/delete-form-cart?id=${id}`, {
            method: "DELETE",
             headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        const data = await res.json();
        return data;

    }catch(error){
        console.log(error);
    }
};