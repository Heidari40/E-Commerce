import Cookies from "js-cookie";

export const callStripeSession = async (formData: any) => {

    try
    {
        const res = await fetch("/api/stripe", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData)

        });

        if(!res.ok){
            return {
                success: false,
                error: res.statusText,
                message: "stripe request failed"
            }
        }

        const data = await res.json();
         return {
            success: true,
            data,
        };

    }catch (error){
        console.log(error);
        return {success: false,  error}
    
    }
}