'use client'
import { motion } from "motion/react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial, index }) {
    return (
        <motion.div
            className="p-6 rounded-lg mx-4 w-80 shrink-0 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: `${index * 0.1}`, type: "spring", stiffness: 260, damping: 22 }}
        >
            {/* TripAdvisor-style star rating */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                    />
                ))}
            </div>

            {/* Testimonial text - more prominent */}
            <p className="text-slate-700 leading-relaxed mb-5 text-base">
                {testimonial.quote}
            </p>

            {/* User info at bottom */}
            <div className="flex gap-3 items-center pt-4 border-t border-slate-100">
                <Image
                    className="size-12 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                    height={50}
                    width={50}
                />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                        <svg className="mt-0.5" width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#0ea5e9" />
                        </svg>
                    </div>
                    <span className="text-sm text-slate-500">{testimonial.handle}</span>
                </div>
            </div>
        </motion.div>
    );
}
