'use client'
import SectionTitle from "@/components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon, Loader2Icon, CheckCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ContactSection() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: '' });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setStatus({ loading: false, success: true, error: '' });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({ loading: false, success: false, error: error.message });
        }
    };

    return (
        <div id="contact" className="px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50 pt-8 pb-12">
            <SectionTitle
                text1="Contact"
                text2="Get in touch with us"
                text3="Have questions about the tours or pub crawls? Want to book a private group tour? Drop us a message and we'll get back to you soon!"
            />

            <form
                onSubmit={handleSubmit}
                className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-700 mt-6 w-full"
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                    <p className="mb-2 font-medium text-slate-900">Your name</p>
                    <div className="flex items-center pl-3 rounded-lg border border-slate-300 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition">
                        <UserIcon className="size-5 text-slate-400" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={status.loading}
                            className="w-full p-3 outline-none bg-transparent text-slate-900 disabled:opacity-50"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 22 }}
                >
                    <p className="mb-2 font-medium text-slate-900">Email</p>
                    <div className="flex items-center pl-3 rounded-lg border border-slate-300 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition">
                        <MailIcon className="size-5 text-slate-400" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={status.loading}
                            className="w-full p-3 outline-none bg-transparent text-slate-900 disabled:opacity-50"
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="sm:col-span-2"
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 22 }}
                >
                    <p className="mb-2 font-medium text-slate-900">Message</p>
                    <textarea
                        name="message"
                        rows={8}
                        placeholder="Enter your message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={status.loading}
                        className="bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition resize-none w-full p-3 outline-none rounded-lg border border-slate-300 text-slate-900 disabled:opacity-50"
                    />
                </motion.div>

                {status.error && (
                    <motion.p
                        className="sm:col-span-2 text-red-600 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {status.error}
                    </motion.p>
                )}

                {status.success && (
                    <motion.div
                        className="sm:col-span-2 flex items-center gap-2 text-green-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CheckCircleIcon className="size-5" />
                        <span>Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                )}

                <motion.button
                    type="submit"
                    disabled={status.loading}
                    className="w-max flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white px-10 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed"
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 22 }}
                >
                    {status.loading ? (
                        <>
                            <Loader2Icon className="size-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            Send Message
                            <ArrowRightIcon className="size-5" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
