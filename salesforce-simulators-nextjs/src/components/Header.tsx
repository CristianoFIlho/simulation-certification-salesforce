"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-controls="navbarSupportedContent"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownAdmin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Administrator
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownAdmin">
                <li>
                  <Link className="dropdown-item" href="/administrator/objectives1-2">
                    Configuration and Setup (Objectives 1-2)
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/administrator/objectives3-4">
                    Configuration and Setup (Objectives 3-4)
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/administrator/objectives5-6">
                    Configuration and Setup (Objectives 5-6)
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMulesoft"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mulesoft
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMulesoft">
                <li>
                  <Link className="dropdown-item" href="/mulesoft/mcd-level-1">
                    MCD - LEVEL 1 (Training platform)
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/mulesoft/mcd-level-2">
                    MCD - LEVEL 2 (Training platform)
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/mulesoft/mcpa-level-1">
                    MCPA - LEVEL 1 (Training platform)
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
