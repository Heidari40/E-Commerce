import Cookies from "js-cookie";



export const CreateNewOrder = async(formData: any) => {
    try{ 
        const response = await fetch("/api/order/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        return {
            success: data.success,
            message: data.message,
            data,
        } 

    }catch(e) {
        console.log(e)
        return {error: true, message: "Network error"}
    }
};

export const GetAllOrdersForUser = async(id: string) => {
    try{ 
        const res = await fetch(`/api/order/get-all-orders?id=${id}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        const data = await res.json();
        return data;

    }catch(e) {
        console.log(e)
    }
}


export const GetOrderDetails = async(id: string) => {
    try{ 

        const res = await fetch(`/api/order/order-details?id=${id}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        const data = await res.json();
        return data;



    }catch(e) {
        console.log(e)
    }
}


export const GetAllOrderForAllUsers = async() => {
    try{ 
        const res = await fetch("/api/order/get-all-orders-for-all-users", {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        const data = await res.json();
        return data;

    }catch(e) {
        console.log(e)
    }
}


export const UpdateStatusOfOrder = async(formData: any) => {
    try{ 
        const res = await fetch(`/api/admin/order/update-order`,{
            method: "PUT",
            headers: {
                "Content-type" : "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
        
        })
        const data = await res.json();
        return data;



    }catch(e) {
        console.log(e)
    }
}