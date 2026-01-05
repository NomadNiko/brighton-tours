'use client'
import SectionTitle from "@/components/SectionTitle"
import { pricingData } from "@/data/pricing";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

export default function PricingSection() {
    return (
        <div id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50 pt-12 pb-0">
            <SectionTitle
                text1="Book Now"
                text2="Brighton Tours & Pub Crawl Tickets"
                text3="Join our free walking tours Brighton or book weeknight pub crawl tickets — flexible options for every traveler exploring Brighton's best attractions."
            />

            {/* Professional, clean pricing cards - white backgrounds */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
                {pricingData.map((plan, index) => (
                    <motion.div
                        key={index}
                        className={`w-80 text-center p-8 pb-10 rounded-xl bg-white border-2 ${
                            plan.mostPopular
                                ? 'border-sky-500 shadow-xl relative ring-4 ring-sky-500/10'
                                : 'border-slate-200 shadow-md'
                        }`}
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.1}`, type: "spring", stiffness: 260, damping: 22 }}
                    >
                        {plan.mostPopular && (
                            <p className="absolute px-4 text-sm font-medium -top-3.5 left-1/2 -translate-x-1/2 py-1.5 bg-sky-500 text-white rounded-full shadow-md">
                                Most Popular
                            </p>
                        )}

                        <p className="font-semibold text-slate-900 text-lg mb-2">{plan.name}</p>

                        <p className="text-5xl font-bold text-slate-900">
                            £{plan.price}
                            <span className="text-slate-500 font-normal text-base">/{plan.period}</span>
                        </p>

                        <ul className="list-none text-slate-600 mt-8 space-y-3 text-left">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckIcon className="size-5 text-sky-500 mt-0.5 flex-shrink-0" />
                                    <p className="leading-relaxed">{feature}</p>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            className={`w-full py-3.5 rounded-lg font-semibold mt-8 transition-all shadow-md hover:shadow-lg ${
                                plan.mostPopular
                                    ? 'bg-sky-500 text-white hover:bg-sky-600'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                        >
                            {plan.price === 0 ? 'Book Free Tour' : 'Buy Tickets'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Add trust indicators */}
            <motion.div
                className="mt-6 text-center"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
                <p className="text-slate-600 text-sm">
                    Trusted by 1,000+ visitors • All tours run rain or shine • Easy online booking
                </p>
            </motion.div>
        </div>
    );
}
