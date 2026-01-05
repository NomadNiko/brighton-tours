'use client'
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { navlinks } from "@/data/navlinks";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Professional navigation bar - white background with shadow */}
            <motion.nav
                className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
            >
                <Link href="/" className="mr-16">
                    <Image
                        className="h-12 w-auto"
                        src="/assets/logo.svg"
                        alt="Brighton Tours logo"
                        width={150}
                        height={48}
                        priority
                    />
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-slate-700 hover:text-sky-600 transition font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Professional CTA button */}
                <a href="#pricing" className="hidden md:block ml-12 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 transition-all rounded-lg text-white font-medium shadow-md hover:shadow-lg">
                    Book Tour
                </a>

                <button onClick={() => setIsOpen(true)} className="md:hidden text-slate-700">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            {/* Mobile menu - clean white background */}
            <div
                className={`fixed inset-0 z-100 bg-white flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {navlinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-slate-800 hover:text-sky-600 transition font-medium text-xl"
                    >
                        {link.name}
                    </Link>
                ))}
                <button
                    onClick={() => setIsOpen(false)}
                    className="active:ring-3 active:ring-sky-300 aspect-square size-12 p-1 items-center justify-center bg-slate-900 hover:bg-slate-800 transition text-white rounded-lg flex"
                >
                    <XIcon />
                </button>
            </div>
        </>
    );
}
