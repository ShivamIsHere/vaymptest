import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-[#142337] text-white">
      <div className="flex justify-between items-center px-4 bg-flipkart-blue py-1 sm:px-12 md:flex md:justify-between md:items-center">
        <h1 className="text-xl font-semibold leading-normal md:w-2/5 lg:text-2xl">
          <span className="text-[#77fc63]">Live chat </span>with us for queries
          <br />
          {/* events and offers */}
        </h1>
        <div>
          <a href="https://wa.me/917277244691" target="_blank">
            <img src="whatsappmsg.png" width="300px" alt="WhatsApp Message" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-8 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <h1 style={{ color: 'white', fontSize: '44px', fontWeight: 'bold' }}>vaymp</h1>
          <br />
          <p>All your city stores at your fingertips.</p>
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer" />
            <AiOutlineTwitter
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillInstagram
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillYoutube
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start hidden lg:block">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start hidden lg:block">
          <h1 className="mb-1 font-semibold">Categories</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start hidden lg:block">
          <h1 className="mb-1 font-semibold">Navigate</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5
     text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© Vaymp. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <div className="flex items-center justify-center">
          <span>Incubated at Lovely Professional University</span>
          <img
            src="/Lovely_Professional_University_logo.png"
            alt="Lovely Professional University Logo"
            className="ml-2 h-8"
          />
        </div>
        <div className="block lg:hidden">
      <br></br>
    </div>
      </div>
    </div>
  );
};

export default Footer;