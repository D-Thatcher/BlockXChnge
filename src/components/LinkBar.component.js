import {Link} from "react-router-dom";
import {APP_NAME} from "../CONSTANTS";
import React from "react";

export const linkBar = ()=>{
    return (
        <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">{APP_NAME}</Link>
            <div className="collpase navbar-collapse">
                <ul className="navbar-nav mr-auto">

                    <li className="navbar-item">
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/about" className="nav-link">About</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/account" className="nav-link">Account</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/blockchain" className="nav-link">Block Chain</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/activeBlocks" className="nav-link">Active Blocks</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/createBlock" className="nav-link">Create Block</Link>
                    </li>

                    {/*<li className="navbar-item">*/}
                        {/*<Link to="/deposit" className="nav-link">Deposit</Link>*/}
                    {/*</li>*/}


                </ul>
            </div>
        </nav>
        <br/>
        </div>
        );
        };
