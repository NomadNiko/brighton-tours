'use client'
import { footerData } from "@/data/footer";
import { InstagramIcon, FacebookIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function Footer() {
    return (
        <footer className="flex flex-wrap justify-between overflow-hidden gap-10 md:gap-20 py-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-900 text-[13px] text-slate-400 border-t border-slate-800">
            <motion.div
                className="flex flex-wrap items-start gap-10 md:gap-35"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
                <Image
                    className="size-16 aspect-square"
                    src="/assets/footer-logo.svg"
                    alt="Brighton Tours footer logo"
                    width={64}
                    height={64}
                    priority
                />
                {footerData.map((section, index) => (
                    <div key={index}>
                        <p className="text-slate-100 font-semibold mb-3">{section.title}</p>
                        <ul className="mt-2 space-y-2">
                            {section.links.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-sky-400 transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </motion.div>

            <motion.div
                className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
                <p className="max-w-60 leading-relaxed">
                    Discover Brighton's hidden gems and iconic landmarks with our passionate local guides.
                </p>
                <div className="flex items-center gap-4 mt-4">
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 transition"
                        aria-label="Instagram"
                    >
                        <InstagramIcon className="size-5" />
                    </a>
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 transition"
                        aria-label="Facebook"
                    >
                        <FacebookIcon className="size-5" />
                    </a>
                </div>
                <p className="mt-4 text-center text-slate-500">
                    &copy; {new Date().getFullYear()} Brighton Tours. All rights reserved.
                </p>
            </motion.div>
        </footer>
    );
}
