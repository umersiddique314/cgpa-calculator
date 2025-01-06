import { GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

export const Header = () => {
  return (
    <motion.div
      className="text-center mb-16 space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 bg-blue-600 dark:bg-blue-400 rounded-full opacity-20 blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <GraduationCap className="w-20 h-20 mx-auto text-blue-600 dark:text-blue-400 mb-6" />
        </motion.div>
      </div>
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        UAF CGPA Calculator
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Calculate your CGPA with precision and ease
      </p>
    </motion.div>
  )
}

