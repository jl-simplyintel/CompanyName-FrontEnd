import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h5 className="text-lg font-semibold mb-4">About SimplyGroup</h5>
          <p className="text-sm leading-relaxed">
            SimplyGroup is your trusted partner for discovering and connecting with local businesses. We provide up-to-date and reliable business information.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
          <ul className="space-y-2">
            <li>
              <Link href="/about" passHref>
                <button className="hover:text-blue-400 cursor-pointer text-left">About Us</button>
              </Link>
            </li>
            <li>
              <Link href="/about#contact-form" passHref>
                <button className="hover:text-blue-400 cursor-pointer text-left">Contact Us</button>
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" passHref>
                <button className="hover:text-blue-400 cursor-pointer text-left">Privacy Policy</button>
              </Link>
            </li>
            <li>
              <Link href="/sitemap" passHref>
                <button className="hover:text-blue-400 cursor-pointer text-left">Sitemap</button>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
          <p className="text-sm mb-2">
            Email:
            <Link href="mailto:info@simplygroup.com" passHref>
              <button className="hover:text-blue-400 cursor-pointer ml-1">info@simplygroup.com</button>
            </Link>
          </p>
          <p className="text-sm mb-4">Phone: +123 456 7890</p>
          <h5 className="text-lg font-semibold mb-4">Follow Us</h5>
          <div className="flex space-x-4">
            <Link href="https://facebook.com/simplygroup" passHref>
              <button className="hover:text-blue-400 cursor-pointer flex items-center">
                <i className="bi bi-facebook mr-1"></i>Facebook
              </button>
            </Link>
            <Link href="https://twitter.com/simplygroup" passHref>
              <button className="hover:text-blue-400 cursor-pointer flex items-center">
                <i className="bi bi-twitter mr-1"></i>Twitter
              </button>
            </Link>
            <Link href="https://instagram.com/simplygroup" passHref>
              <button className="hover:text-blue-400 cursor-pointer flex items-center">
                <i className="bi bi-instagram mr-1"></i>Instagram
              </button>
            </Link>
            <Link href="https://linkedin.com/company/simplygroup" passHref>
              <button className="hover:text-blue-400 cursor-pointer flex items-center">
                <i className="bi bi-linkedin mr-1"></i>LinkedIn
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        &copy; 2024 SimplyGroup. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
