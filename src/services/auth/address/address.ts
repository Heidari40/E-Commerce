
import Cookies from "js-cookie"


export const addNewAddress = async (formatData: any) => {
    try {
        const res = await fetch("/api/address/add-new-address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`

            },
            body: JSON.stringify( formatData )

        });
        const data = await res.json();
        return data;


    } catch (error) {

        console.log(error);
        return {success: false, message: "Something went wrong"};
    }

}

export const updateAddress = async (formatData: any) => {

    try {
        const res = await fetch("/api/address/update-address", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`

            },
            body: JSON.stringify(formatData)
        });
        const data = await res.json();
        return data;
    } catch (error) {
       
        console.log(error);
        return {success: false, message: "Something went wrong"};
    };


}

export const fetchAlladdresses = async (id: string) => {
    try {
        const res = await fetch(`/api/address/get-all-address?id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        const data = await res.json();
        return data;

} catch (error) {
     console.log(error)
        console.log(error);
        return {success: false, message: "Something went wrong"};
    }
}

export const deleteAddress = async (id: string) => {
    try {
        const res = await fetch(`/api/address/delete-address?id=${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            },
            method: "DELETE"
        
        })
        const data = await res.json();
        return data;

}catch  (error) {
   
        console.log(error);
        return {success: false, message: "Something went wrong"};
    }
}
