type TileProps = {
    data: any[],
    selected?: any[],
    onClick: (item: any) => void;

};


export default function TileComponent({ data, selected = [], onClick }: TileProps) {
    
    return data && data.length ? (

        <div className="mt-3 flex flex-wrap items-center gap-2  ">
            {

                data.map((dataItem) => (
                    <label
                        className={`cursor-pointer ${selected && selected.length &&
                            //Den bruger .some() i stedet for .map().indexOf()
                            selected.some(item => item.id === dataItem.id) 
                            ? "bg-black"
                            : ""

                            }`}
                            key={dataItem.id}
                            onClick={() => onClick(dataItem)}
                    >
                        <span 
                         className={`border rounded-xl border-black px-6 py-2 font-bold
                             ${selected && selected.length &&
                            selected.some(item => item.id === dataItem.id) 
                            ? "text-white"
                            : ""

                            }`}
                        >
                            {dataItem.label}
                        </span>

                    </label>

                ))
            }
        </div>
    ) :null
}


