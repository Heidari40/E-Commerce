import Cookies from "js-cookie";

type SizeOption = {
    id: string;
    label: string;
}

type FormData = {
    
    name: string;
    price: number;
    description: string;
    category: string;
    deliveryInfo: string;
    onSale: string;
    priceDrop: number;
    sizes: SizeOption[];
    imageUrl: string;
};



export const addNewProduct = async (formData: FormData) => {
    try {
        const response = await fetch("/api/admin/add-product", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,

            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }

}

export const getAllAdminProducts = async () => {
    try {
        const response = await fetch("/api/all-products", {
            method: "GET",
           cache: "no-store", 
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}

export const updateProduct = async (formData: FormData) => {
    try {
        const response = await fetch("/api/admin/update-product", {
            method: "PUT",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
        return ({
            success: false,
            message: "Something went wrong"
        });

    }
}
export const deleteProduct = async (id: string) => {
    try {

        const response = await fetch(`/api/admin/delete-product?id=${id}`, {
            method: "DELETE",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },

        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const ProductByCategory = async (id: string) => {
    try{
       
        const res = await fetch(`/api/admin/product-by-category?id=${id}`, {
            method: "GET",
            cache: "no-store",
        });
        const data = await res.json();
        return data;

    }catch(error){
        console.log(error);
    }
}

export const ProductById = async (id: string) => {

    try{
        
        const response = await fetch(`/api/admin/product-by-id?id=${id}`, {
            method: "GET",
            cache: "no-store",
        });
        const data = await response.json();
        return data;

    }catch(error){
        console.log(error);
    }
}