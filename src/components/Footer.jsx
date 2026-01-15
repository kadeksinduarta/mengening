import React from "react";

const Footer = () => {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285857864840";
  const whatsappMessage = encodeURIComponent(
    "Halo 👋\nSaya ingin menanyakan tentang jadwal dan cara booking melukat di Pura Mengening. Terima kasih 🙏"
  );

  return (
    <footer className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-12">
          <div>
            <p className="text-3xl font-playfair font-bold text-white mb-2">Tasya Melukat</p>
            <p className="text-slate-500 text-sm tracking-wide">Pura Mengening, Tampaksiring, Bali</p>
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/aprl_tasyya"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.227-1.669 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.669-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.626c-3.141 0-3.505.012-4.73.068-2.663.123-3.95 1.417-4.072 4.072-.056 1.225-.068 1.588-.068 4.73s.012 3.505.068 4.73c.123 2.654 1.409 3.948 4.072 4.072 1.225.056 1.588.068 4.73.068s3.505-.012 4.73-.068c2.663-.123 3.95-1.417 4.072-4.072.056-1.225.068-1.588.068-4.73s-.012-3.505-.068-4.73c-.123-2.654-1.409-3.948-4.072-4.072C15.505 3.801 15.141 3.789 12 3.789zm0 4.26a3.951 3.951 0 100 7.902 3.951 3.951 0 000-7.902zm0 6.313a2.362 2.362 0 110-4.724 2.362 2.362 0 010 4.724zM16.848 7.21a1.173 1.173 0 100 2.346 1.173 1.173 0 000-2.346z"></path>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.06 21.94L7.3 20.58C8.75 21.37 10.35 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 20.13C10.5 20.13 9.01 19.7 7.7 18.91L7.34 18.7L3.7 19.64L4.67 16.11L4.47 15.74C3.6 14.36 3.12 12.8 3.12 11.91C3.12 7.02 7.11 3 12.04 3C16.97 3 20.96 7.02 20.96 11.91C20.96 16.8 16.97 20.13 12.04 20.13M17.39 14.4C17.14 14.28 15.91 13.7 15.69 13.62C15.46 13.54 15.3 13.49 15.13 13.74C14.97 13.98 14.49 14.59 14.33 14.75C14.17 14.92 14.01 14.94 13.76 14.82C13.51 14.7 12.51 14.38 11.36 13.34C10.45 12.51 9.87 11.5 9.71 11.25C9.55 11 9.66 10.89 9.78 10.77C9.89 10.66 10.04 10.46 10.18 10.3C10.31 10.14 10.37 10.02 10.46 9.85C10.55 9.68 10.5 9.53 10.42 9.36C10.34 9.19 9.77 7.76 9.54 7.17C9.32 6.6 9.09 6.63 8.91 6.62C8.73 6.61 8.57 6.61 8.41 6.61C8.25 6.61 7.99 6.68 7.78 6.93C7.58 7.17 7 7.73 7 8.89C7 10.05 7.8 11.16 7.92 11.32C8.04 11.48 9.81 14.22 12.49 15.34C13.2 15.65 13.73 15.82 14.13 15.96C14.68 16.14 15.15 16.11 15.5 16.05C15.89 15.97 16.91 15.42 17.11 14.86C17.31 14.3 17.31 13.84 17.25 13.74C17.19 13.64 17.03 13.58 16.78 13.47C16.53 13.35 17.64 14.52 17.39 14.4Z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="w-full h-px bg-slate-800 mb-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tasya Melukat Mengening. All rights reserved.
          </p>
          <div className="flex space-x-6 text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
