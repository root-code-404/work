import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
  { title: "Blog", link: "/blog" },
];

const Footer = () => {
  return (
    <div
      style={BannerImg}
      className="text-white bg-gray-900 bg-opacity-80 py-10"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-4">
              <img
                src={footerLogo}
                alt="Shopsy Logo"
                className="w-12 h-12 rounded-full"
              />
              Shopsy
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Explore a wide range of quality products with fast delivery and
              secure payment methods. Shop with us for a seamless experience!
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
              <ul className="text-sm text-gray-300 space-y-2">
                {FooterLinks.map((link) => (
                  <li key={link.title} className="hover:text-gray-400">
                    <a href={link.link}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links and Contact */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-3">Connect With Us</h2>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="hover:text-gray-400"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="hover:text-gray-400"
                >
                  <FaFacebook className="text-2xl" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="hover:text-gray-400"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="flex items-center gap-3 text-gray-300">
                <FaLocationArrow />
                Noida, Uttar Pradesh
              </p>
              <p className="flex items-center gap-3 text-gray-300 mt-3">
                <FaMobileAlt />
                +91 123456789
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-6 text-sm">
          &copy; {new Date().getFullYear()} Shopsy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
