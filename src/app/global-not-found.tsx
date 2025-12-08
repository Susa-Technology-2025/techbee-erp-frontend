export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | TechBee ERP</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .floating { animation: float 6s ease-in-out infinite; }
          .glow {
            text-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
          }
          .grid-pattern {
            background-image: 
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
          }
          .fade-in {
            animation: fadeIn 1.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </head>
      <body className="bg-black text-white flex items-center justify-center min-h-screen overflow-hidden relative grid-pattern">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern z-0"></div>

        {/* Animated border effect */}
        <div className="absolute inset-0 border-2 border-transparent hover:border-indigo-500/20 transition-all duration-1000 pointer-events-none"></div>

        <main className="text-center px-6 z-10 relative max-w-2xl fade-in">
          {/* Logo placeholder - replace with your actual logo */}
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-indigo-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="floating">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 glow">
              404
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl text-gray-300 mb-6 font-medium">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-400 mb-10">
            The requested resource could not be located. Please verify the URL
            or contact support.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Return to Home
            </a>
            <a
              href="tel:0964792216"
              className="inline-block px-8 py-3 border border-gray-700 text-gray-300 font-medium rounded-md hover:bg-gray-900/50 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Contact Support: contact@erp.susa.et
            </a>
          </div>

          {/* Technical details for developers */}
          <div className="mt-16 pt-6 border-t border-gray-800/50">
            <p className="text-sm text-gray-500">
              TechBee ERP System • Error 404 • Resource Not Found
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
