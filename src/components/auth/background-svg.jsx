import { motion } from "framer-motion";

export default function BackgroundSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Navy → Orange */}
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F3831C" stopOpacity="0.25" />
        </linearGradient>

        {/* Slate → Soft Orange */}
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F3831C" stopOpacity="0.15" />
        </linearGradient>

        {/* Glow */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Grid */}
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="#0F172A"
            strokeWidth="0.6"
            opacity="0.08"
          />
        </pattern>
      </defs>

      {/* Background Grid */}
      <rect width="1000" height="1000" fill="url(#grid)" />

      {/* Animated Rings */}
      <motion.circle
        cx="150"
        cy="150"
        r={120}
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="2"
        filter="url(#glow)"
        animate={{
          r: [120, 150, 120],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.circle
        cx="850"
        cy="200"
        r={180}
        fill="none"
        stroke="url(#grad2)"
        strokeWidth="2"
        filter="url(#glow)"
        animate={{
          r: [180, 220, 180],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.circle
        cx="100"
        cy="850"
        r={100}
        fill="none"
        stroke="#F3831C" // 👈 highlight accent
        strokeWidth="2.5"
        filter="url(#glow)"
        animate={{
          r: [100, 140, 100],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.circle
        cx="850"
        cy="800"
        r={130}
        fill="none"
        stroke="url(#grad2)"
        strokeWidth="2"
        filter="url(#glow)"
        animate={{
          r: [130, 170, 130],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Wave Lines */}
      <motion.path
        d="M 0 300 Q 250 250 500 300 T 1000 300"
        stroke="url(#grad1)"
        strokeWidth="1.5"
        fill="none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.path
        d="M 0 700 Q 250 650 500 700 T 1000 700"
        stroke="url(#grad2)"
        strokeWidth="1.5"
        fill="none"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
      />

      {/* Moving Wave */}
      <motion.path
        d="M -100 400 Q 0 350 100 400 T 300 400 T 500 400 T 700 400 T 900 400 T 1100 400"
        stroke="url(#grad2)"
        strokeWidth="1"
        fill="none"
        animate={{
          x: [0, 100, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
