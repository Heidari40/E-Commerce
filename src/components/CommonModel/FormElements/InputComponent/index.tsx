
type inputProps = {
    label: string;
    placeholder: string;
    type?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    
}

export default function InputComponent({label, placeholder, type, value, onChange}: inputProps){
    return(
        <div className="relative">
            <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mb-0 ml-2 font-medium text-gray-600 bg-white">
                {label}
            </p>
            <input
            placeholder={placeholder}
            type={type||"text"}
            value={value}
            onChange={onChange}
            className="border pl-2 placeholder-gray-400 focuse:outline-none focus:border-black w-full pt-4 pb-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
            />
        </div>
    )
}