import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", id: "home" },
    { label: "About", href: "/#about", id: "about" },
    { label: "Blog", href: "/blog", id: "blog" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent border-b border-white/10 py-5"
          }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group"
            >
              <img
                src="/Logo_Tasya.png"
                alt="Tasya Melukat"
                className={`w-10 h-10 rounded-xl transition-all duration-300 ${scrolled || isOpen ? "shadow-md" : "brightness-110"}`}
              />
              <span
                className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${scrolled || isOpen ? "text-slate-800" : "text-white"}`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tasya Melukat
              </span>
            </a>

            {/* Desktop Menu */}
            <ul className="hidden md:flex md:items-center space-x-10">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    className={`text-sm font-medium transition-colors duration-300 hover:text-blue-500 relative group ${scrolled || isOpen ? "text-slate-600" : "text-white/90 hover:text-white"
                      }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${activeSection === item.id ? 'w-full' : ''}`}></span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/booking"
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 ${scrolled || isOpen
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-slate-900 hover:bg-gray-100"
                    }`}
                >
                  Book Now
                </a>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden focus:outline-none transition-colors duration-300 ${scrolled || isOpen ? "text-slate-800" : "text-white"
                }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden"
            >
              <ul className="flex flex-col p-6 space-y-4">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-lg font-medium text-slate-800 hover:text-blue-600"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-4">
                  <a
                    href="/booking"
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Now
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
