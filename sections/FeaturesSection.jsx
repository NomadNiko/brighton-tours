'use client'
import SectionTitle from "@/components/SectionTitle";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { featuresData } from "@/data/features";

export default function FeaturesSection() {
    return (
        <div id="features" className="px-4 md:px-16 lg:px-24 xl:px-32 bg-white pt-8 pb-0">
            <SectionTitle
                text1="Walking Tours"
                text2="Why Choose Our Brighton Walking Tours"
                text3="Experience authentic Brighton tours with expert local guidance, flexible pricing, and unforgettable adventures through the city's iconic landmarks."
            />

            {/* Clean, professional feature cards - white backgrounds */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-6 px-6">
                {featuresData.map((feature, index) => (
                    <motion.div
                        key={index}
                        className={`tour-card p-6 rounded-xl space-y-4 max-w-80 w-full ${
                            index === 1 ? 'ring-2 ring-sky-500/20 shadow-lg' : ''
                        }`}
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.1}`, type: "spring", stiffness: 260, damping: 22 }}
                    >
                        <div className="text-sky-500">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            {feature.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Image showcase section - professional layout */}
            <div className="mt-8 relative mx-auto max-w-5xl">
                <motion.p
                    className="text-slate-700 text-lg text-left max-w-3xl leading-relaxed"
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                    Our Brighton walking tours and pub crawls offer authentic experiences led by our experienced local guides, passionate about showing visitors the best of Brighton's culture, history, and nightlife.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-8">
                    <motion.div
                        className="md:col-span-2"
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 22 }}
                    >
                        {/* IMAGE SOURCING INSTRUCTIONS:
                            Download from: https://unsplash.com/s/photos/brighton-pier
                            Use: High-quality image of Brighton Palace Pier at sunset/golden hour
                            Specs: 1200x600px minimum, professional photography
                            Examples: Pier with lights at dusk, iconic seaside view
                        */}
                        <Image
                            className="h-full w-full object-cover rounded-lg shadow-md"
                            src="/assets/features-showcase-1.jpg"
                            alt="Brighton Royal Pavilion - iconic landmark on our walking tours"
                            width={1000}
                            height={500}
                        />
                    </motion.div>

                    <motion.div
                        className="md:col-span-1 flex flex-col"
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 22 }}
                    >
                        {/* IMAGE SOURCING INSTRUCTIONS:
                            Download from: https://unsplash.com/s/photos/brighton-lanes
                            Use: The Lanes or North Laine shopping district
                            Specs: 600x600px minimum, street-level photography
                            Examples: Colorful shop fronts, narrow lanes, vintage atmosphere
                        */}
                        <Image
                            src="/assets/features-showcase-2.jpg"
                            alt="Brighton's historic Lanes shopping district featured in our walking tours"
                            width={600}
                            height={600}
                            className="hover:-translate-y-1 transition duration-300 rounded-lg shadow-md object-cover"
                        />
                        <h3 className="text-2xl text-slate-900 font-semibold mt-6">
                            Discover Brighton's Best Landmarks
                        </h3>
                        <p className="text-slate-600 mt-3 leading-relaxed">
                            From the Royal Pavilion and Brighton Palace Pier to the trendy North Laine and historic Lanes, our Brighton tours reveal the stories behind the city's most iconic attractions.
                        </p>
                        <a
                            href="#pricing"
                            className="group flex items-center gap-2 mt-5 text-sky-600 hover:text-sky-700 transition font-medium"
                        >
                            Book your tour today
                            <ArrowUpRight className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
