// import { motion } from "framer-motion";

// export default function LoginImage() {
//   return (
//     <div className="relative w-full h-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
//       {/* glow background */}
//       <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl bg-[#F3831C]/20" />

//       {/* BACK IMAGE */}
//       <motion.div
//         className="absolute w-[260px] md:w-[320px] lg:w-[360px] rounded-xl overflow-hidden shadow-xl"
//         style={{ left: "40%", top: "55%", transform: "translate(-50%, -50%)" }}
//         animate={{
//           y: [0, -8, 0],
//           rotate: [0, -2, 0],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <img
//           src="/img/em2.png"
//           className="w-full h-full object-cover opacity-80"
//         />
//       </motion.div>

//       {/* FRONT IMAGE */}
//       <motion.div
//         className="relative w-[300px] md:w-[380px] lg:w-[420px] rounded-2xl overflow-hidden shadow-2xl z-10"
//         animate={{
//           y: [0, -12, 0],
//           rotate: [0, 1.5, 0],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <img src="/img/em1.png" className="w-full h-full object-cover" />
//       </motion.div>

//       {/* soft overlay */}
//       <div className="absolute inset-0 bg-[#0F172A]/40" />
//     </div>
//   );
// }

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function LoginImage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set(e.clientX / innerWidth - 0.5);
    mouseY.set(e.clientY / innerHeight - 0.5);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className=" w-full h-full flex items-center justify-center bg-[#0F172A] overflow-hidden"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative flex items-center justify-center bg-pink-600"
      >
        {/* LEFT IMAGE */}
        <motion.div
          className="absolute w-[260px] md:w-[320px] lg:w-[360px]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <img src="/img/em2.png" className="w-full h-full object-cover" />
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="absolute w-[260px] md:w-[320px] lg:w-[360px]"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <img src="/img/em1.png" className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}
