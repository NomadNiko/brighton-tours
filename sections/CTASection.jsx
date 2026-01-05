'use client'
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <motion.div
            className="max-w-5xl py-12 mb-12 md:pl-16 md:pr-16 md:w-full max-md:mx-4 md:mx-auto flex flex-col md:flex-row max-md:gap-6 items-center justify-between text-left bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-8 md:p-12 text-white shadow-xl"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
            <div className="max-md:text-center">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-white"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 22 }}
                >
                    Ready for a Brighton Walking Tour?
                </motion.h2>
                <motion.p
                    className="text-sky-50 text-lg mt-3 max-w-lg"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 22 }}
                >
                    Join our free walking tours or affordable weeknight pub crawls with our experienced local guides. Experience authentic Brighton with experts who know the city inside out.
                </motion.p>
            </div>

            <motion.button
                className="px-10 py-4 text-sky-600 bg-white hover:bg-slate-50 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex-shrink-0"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 22 }}
            >
                Book Now
            </motion.button>
        </motion.div>
    );
}
