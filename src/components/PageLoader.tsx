import { motion } from "framer-motion";

export const PageLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="min-h-screen flex items-center justify-center p-4"
  >
    <div className="relative">
      <div className="w-16 h-16">
        <motion.div
          className="absolute w-full h-full border-4 border-[#700100] rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.5, 1],
            rotate: 360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute w-full h-full border-4 border-[#700100] rounded-full"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 1, 0.5],
            rotate: -360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <motion.img 
        src="/logo.png"
        alt="Fiori Logo"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"
        animate={{
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  </motion.div>
);