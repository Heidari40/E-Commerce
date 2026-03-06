type formDataProups = {
    email: string;
    password: string;
}

export const login = async(formData: formDataProups) => {
    try{
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    }catch(error){
        console.log(error);
    }
}