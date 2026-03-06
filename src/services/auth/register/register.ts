type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    role: string;
}


export const registerNewUser = async (formData: RegisterFormData) => {
 
    try{
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(formData),
        })
       
        return await response.json();
    }
    catch(e){
        console.log("error", e);
    
    }
}