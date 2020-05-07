import React from 'react';
import '../css/header.css';
import lawnmawer from '../static/lawnmawer.gif'


function Header() {
    return (
        <header className="green rounded">
            <h1 class="title animated slideInLeft">- LawnMawer -<img src={lawnmawer} alt="kosiara" height="80" width="80" /></h1>
            
            
        </header>
        
    )
}

export default Header;