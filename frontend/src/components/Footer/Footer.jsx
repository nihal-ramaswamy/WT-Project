import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './Footer.css';

const FooterComponent = () => {
    return ( 
        <footer className = "fOoter" >
        <div className="my-footer-container">
            <div className="footer-text-container">
            A progressive web-app project as a part of the Web Technologies course (UE19CS204) at PES University.
            </div>
            <div className="other-links-container">

                <a style={{fontSize: "2.5vmin"}} className="" href="https://github.com/nihal-ramaswamy/WT-Project" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="my-footer-icon" />
                </a>

            </div>
        </div>
        </footer>
     );
}
 
export default FooterComponent;