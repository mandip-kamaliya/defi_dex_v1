/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";

interface Headerprops{
    className?:string
}


const Header : React.FC<Headerprops>=(props)=>{
    return (
        <>
            <header className="header"></header>
        </>
    )

}

export default Header;