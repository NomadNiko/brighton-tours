import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";

export const metadata = {
    title: "Free Walking Tours & Pub Crawls in Brighton",
    description: "Free walking tours of Brighton's Royal Pavilion, Palace Pier & The Lanes. Expert local guides. Plus affordable weeknight pub crawls Sun-Thu.",
};

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <CookieConsent />
        </>
    );
}
