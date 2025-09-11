"use client"
import React from "react";

type ButtonProps={
    name: string;
    backgroundColor ?: string;
    onClick?: () => void;
    className?: string;
}


export default function Button({

    name,
    backgroundColor = "bg-sky-400",
    onClick,
    className
}: ButtonProps){
    return(
        <button   className={`${backgroundColor} text-white px-4 py-2 border-0 rounded-lg hover:opacity-90 transition font-bold  ${className}`} onClick={onClick}>
            {name}
        </button>
       
    )
}