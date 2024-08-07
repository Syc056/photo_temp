import React from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import '../css/HomeButton.css';

const HomeButton = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        sessionStorage.clear();
        navigate('/');
    }

    return (
        <button className="home-button" onClick={handleClick}>
            <FaHome size={100} />
        </button>
    )
}

export default HomeButton;