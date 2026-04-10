"use client";

export default function Unauthorized(){
    return(

        <section className="h-screen bg-gray-200">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mt-8 mx-w-screen-sm px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow">
                        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 flex flex-col gap-5">
                            
                                 <h1 className="font-bold text-lg">
                                You don't have permission to access this page. Please login to continue.
                            </h1>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}