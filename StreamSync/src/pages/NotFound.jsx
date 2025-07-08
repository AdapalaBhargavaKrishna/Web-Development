import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import searchsvg from '../assets/searchp.svg'
import homesvg from '../assets/homep.svg'
import linksvg from '../assets/linkp.svg'
import errorsvg from '../assets/error.svg'

const NotFound = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen p-4'
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='p-8 sm:p-10 bg-white rounded-xl flex flex-col items-center shadow-lg text-center max-w-md w-full space-y-6'
            >
                <motion.div variants={itemVariants}>
                    <div className='p-4 bg-red-100 rounded-full w-20 h-20 flex items-center justify-center'>
                        <img src={errorsvg} className='w-12 h-12' alt="Error" />
                    </div>
                </motion.div>

                <motion.h1 variants={itemVariants} className='text-3xl sm:text-4xl font-bold text-gray-800'>
                    Room Not Found
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg text-gray-600">
                    The room code <span className="font-mono font-semibold text-red-500 bg-red-50 px-1 py-0.5 rounded inline-block mx-auto">
                        {roomId}
                    </span> doesn't exist.
                </motion.p>

                <motion.p variants={itemVariants} className="text-sm text-gray-500">
                    It might have been deleted, expired, or you may have entered the wrong code.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="p-4 rounded-xl w-full bg-gray-50 border border-gray-100"
                >
                    <h3 className="font-semibold mb-3 text-gray-900">What you can do:</h3>
                    <div className="space-y-3 text-sm">
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start space-x-3 text-gray-600"
                        >
                            <img src={searchsvg} alt="Search" className="mt-0.5 flex-shrink-0" />
                            <span>Double-check the room code for typos</span>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start space-x-3 text-gray-600"
                        >
                            <img src={homesvg} alt="Home" className="mt-0.5 flex-shrink-0" />
                            <span>Create a new room and invite your friends</span>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start space-x-3 text-gray-600"
                        >
                            <img src={linksvg} alt="Link" className="mt-0.5 flex-shrink-0" />
                            <span>Ask your friend to share the room link again</span>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoHome}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                >
                    Go to Home
                </motion.button>

                <motion.p variants={itemVariants} className="text-xs text-gray-400">
                    Room codes are 6 characters long and case-sensitive
                </motion.p>
            </motion.div>
        </motion.div>
    )
}

export default NotFound