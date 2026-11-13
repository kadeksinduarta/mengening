/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Mencegah situs ditanam di <iframe> milik orang lain, yang biasa
          // dipakai untuk clickjacking pada halaman login admin.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Browser tidak boleh menebak tipe file dari isinya. Relevan karena
          // pengunjung bisa mengunggah bukti transfer.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Situs tujuan hanya menerima domain, bukan URL lengkap.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Fitur perangkat yang tidak dipakai situs ini dimatikan.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Area admin tidak boleh diindeks maupun di-cache perantara.
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
