import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285857864840";
  const message = "Hai, saya ingin memesan layanan Anda."; // Pesan default

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div
      className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center group"
      style={{
        pointerEvents: "none", // supaya tidak blokir elemen di bawah
      }}
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-green-600 flex items-center justify-center relative overflow-hidden"
        style={{
          pointerEvents: "auto", // tombol tetap bisa diklik
        }}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
        <FaWhatsapp className="text-3xl md:text-4xl relative z-10" />
      </a>
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat Kami
      </span>
    </div>
  );
}
