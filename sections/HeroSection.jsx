'use client'
import { CheckIcon, ChevronRightIcon, VideoIcon } from "lucide-react";
import TiltedImage from "@/components/TiltImage";
import { motion } from "motion/react";

export default function HeroSection() {
    const specialFeatures = [
        "Expert local guides",
        "Pay what you feel",
        "Years of experience",
    ];

    return (
        <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-b from-slate-50 to-white pt-12 pb-0">
            {/* Subtle background accent - professional, not overpowering */}
            <div className="absolute top-30 -z-10 left-1/4 size-72 bg-sky-400/10 blur-[200px]"></div>

            {/* Clean badge - minimal styling */}
            <motion.a
                href="#pricing"
                className="group flex items-center gap-2 rounded-full p-1 pr-3 mt-20 text-slate-700 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
                <span className="bg-sky-500 text-white text-xs px-3.5 py-1 rounded-full font-medium">
                    NEW
                </span>
                <p className="flex items-center gap-1 text-sm">
                    <span>Weeknight Pub Crawl now available</span>
                    <ChevronRightIcon size={16} className="group-hover:translate-x-0.5 transition duration-300" />
                </p>
            </motion.a>

            {/* Clean, professional headline */}
            <motion.h1
                className="text-5xl/tight md:text-6xl/tight font-semibold max-w-3xl text-center mt-8 text-slate-900"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                Free Walking Tours of{" "}
                <span className="brighton-text-accent">Brighton</span>
            </motion.h1>

            <motion.p
                className="text-base text-center text-slate-600 max-w-2xl mt-6 leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
                Experience authentic Brighton walking tours exploring iconic landmarks from the Royal Pavilion to the vibrant Lanes. Expert local guides with years of experience. Plus, affordable Brighton pub crawls Sunday-Thursday!
            </motion.p>

            {/* Professional CTA buttons - solid colors */}
            <motion.div
                className="flex flex-wrap items-center justify-center gap-4 mt-8"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            >
                <a href="#pricing" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-8 h-12 font-medium shadow-md hover:shadow-lg transition-all flex items-center">
                    Book Free Tour
                </a>
                <a href="#pricing" className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition rounded-lg px-7 h-12 font-medium shadow-sm hover:shadow-md">
                    <VideoIcon strokeWidth={1.5} size={20} />
                    <span>Pub Crawl Tickets</span>
                </a>
            </motion.div>

            {/* Clean feature list */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
                {specialFeatures.map((feature, index) => (
                    <motion.p
                        className="flex items-center gap-2"
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.1}`, duration: 0.4 }}
                    >
                        <CheckIcon className="size-5 text-sky-500" />
                        <span className="text-slate-600 font-medium">{feature}</span>
                    </motion.p>
                ))}
            </div>

            {/* TODO: Add credibility badges here */}
            {/* - TripAdvisor rating badge */}
            {/* - "As featured in" media logos (The Guardian, Time Out, etc) */}
            {/* - Blue Badge Guide credentials if applicable */}

            <TiltedImage />
        </div>
    );
}
