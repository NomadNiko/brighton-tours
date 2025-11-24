import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "Brighton Tours | Free Walking Tours & Pub Crawls with Niko the Nomad",
    description: "Discover Brighton's iconic landmarks with expert local guide Niko the Nomad. Free walking tours of the Royal Pavilion, Palace Pier, The Lanes & more. Plus weeknight pub crawls Sun-Thu.",
};

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
