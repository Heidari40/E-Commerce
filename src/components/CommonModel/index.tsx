'use client'
import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";

type CommonModelProps = {
    modalTitle?: React.ReactNode;
    mainContent?: React.ReactNode;
    showbuttons: boolean;
    buttonComponent?: React.ReactNode ;
    show: boolean;
    setShow: (value: boolean) => void;
    showModelTitle?: boolean;
}


export default function CommonModel({ modalTitle, mainContent, showbuttons, buttonComponent, show, setShow, showModelTitle }: CommonModelProps) {
    
    return (
        <Transition  as={Fragment} show={show}>
            <Dialog as="div" className={" relative   "} onClose={setShow}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="relative inset-0 overflow-hidden">
                        <div className="fixed inset-y-0 right-0 fix max-w-full pl-10 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className={"w-screen max-w-md"}>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 ">
                                            {
                                                showModelTitle ? <div className="flex items-start justify-between">
                                                <Dialog.Title >
                                                    {modalTitle}
                                                </Dialog.Title>
                                            </div> : null
                                            }
                                            <div className="flex-1 justify-end overflow-y-auto px-4 sm:px-6 ">
                                                {mainContent}
                                            </div>
                                        </div>
                                        {showbuttons ? ( <div className="border-t px-4 py-6 sm:px-6">
                                             {buttonComponent}
                                         </div>
                                     ) : null}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}