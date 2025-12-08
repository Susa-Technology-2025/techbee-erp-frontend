"use client";
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Orb Background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          style={{
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          style={{
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-10 max-w-lg w-full mx-auto">
        {/* Animated Logo */}
        <div className="text-center mb-8">
          <div
            className="text-8xl mb-4 mx-auto w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          >
            <span style={{ animation: "spin 3s linear infinite" }}>🌌</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Quantum Dashboard
          </h1>
          <p className="text-white/60 text-lg">Loading your cosmic data...</p>
        </div>

        {/* Progress Container */}
        <div className="mb-8">
          <div className="flex justify-between text-white/80 text-sm mb-3">
            <span>Warp Drive Engaged</span>
            <span>🌠</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full relative"
              style={{
                width: "100%",
                transform: "translateX(-100%)",
                animation: "quantumLoad 2s ease-in-out infinite",
              }}
            >
              <div
                className="absolute inset-0 bg-white/40 rounded-full"
                style={{
                  animation: "sparkle 0.6s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading Modules */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            {
              emoji: "📈",
              name: "Analytics",
              color: "from-green-400 to-emerald-500",
            },
            { emoji: "👥", name: "Users", color: "from-blue-400 to-cyan-500" },
            {
              emoji: "💰",
              name: "Revenue",
              color: "from-yellow-400 to-orange-500",
            },
            {
              emoji: "⚡",
              name: "Performance",
              color: "from-purple-400 to-pink-500",
            },
          ].map((module, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-sm"
              style={{
                opacity: 0,
                animation: `modulePop 0.5s ease-out ${
                  index * 0.1 + 0.5
                }s forwards`,
              }}
            >
              <div
                className={`text-3xl mb-2 bg-gradient-to-r ${module.color} bg-clip-text text-transparent`}
                style={{
                  animation: "pulse 2s infinite",
                }}
              >
                {module.emoji}
              </div>
              <div className="text-white/70 text-sm font-medium">
                {module.name}
              </div>
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-cyan-400/30">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-white/80 text-sm font-medium">
              Quantum Systems Online
            </span>
            <span className="text-lg">🚀</span>
          </div>
        </div>
      </div>

      {/* Advanced CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
          }
          to {
            box-shadow: 0 0 40px rgba(192, 38, 211, 0.8);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes quantumLoad {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes modulePop {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
