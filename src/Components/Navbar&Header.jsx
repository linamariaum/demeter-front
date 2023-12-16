import React, { useState } from 'react';
import logo from '../img/logo.png'
import '../css/style.css'
import '../css/landing.css'
import Navbar from './Navbar';
import Header from './Header';

const NavbarHeader = () => {
    return (
        <div>
            <div className={`loader-bg`}>
                <div className="loader-track">
                    <div className="loader-fill">Menú</div>
                </div>
            </div>

            <div className={`pc-mob-header pc-header`}>
                <div className="pcm-logo">
                    <img src={logo} alt="Demeter SOFT" className="logo logo-lg" width="130" height="60" />
                </div>
                <div className="pcm-toolbar">
                    <a href="#!" className="pc-head-link">
                        <div className="hamburger hamburger--arrowturn">
                            <div className="hamburger-box">
                                <div className="hamburger-inner"></div>
                            </div>
                        </div>
                    </a>
                    <a href="#!" className="pc-head-link" id="headerdrp-collapse">
                        <i data-feather="align-right"></i>
                    </a>
                    <a href="#!" className="pc-head-link" id="header-collapse">
                        <i data-feather="more-vertical"></i>
                    </a>
                </div>
            </div>
            <Navbar />
            <Header />
        </div>
    );
};

export default NavbarHeader;
