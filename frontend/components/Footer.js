"use client";
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-center">
          Made by <strong>Pankaj Garg</strong>
        </div>

        <a
          href="https://github.com/Garg-Pankaj29"
          target="_blank"
          rel="noopener noreferrer"
          className="app-footer-github"
          title="Pankaj Garg on GitHub"
          aria-label="Pankaj Garg on GitHub"
        >
          <FaGithub size={18} />
        </a>
      </div>
    </footer>
  );
}
