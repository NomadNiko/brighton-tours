'use client'
import { motion } from "motion/react";

export default function SectionTitle({ text1, text2, text3 }) {
    return (
        <>
            {/* Clean, minimal badge - professional tourism site style */}
            <motion.p
                className="text-center font-medium text-sky-600 mt-0 px-6 py-2 rounded-full bg-sky-50 border border-sky-200 w-max mx-auto text-sm"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {text1}
            </motion.p>

            {/* Strong, clear heading */}
            <motion.h2
                className="text-3xl md:text-4xl font-semibold text-center mx-auto mt-4 text-slate-900"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 20 }}
            >
                {text2}
            </motion.h2>

            {/* Professional description text */}
            <motion.p
                className="text-slate-600 text-center mt-3 max-w-2xl mx-auto leading-relaxed"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 20 }}
            >
                {text3}
            </motion.p>
        </>
    );
}
