import SectionTitle from "@/components/SectionTitle";
import TestimonialCard from "@/components/TestimonialCard";
import { testimonialsData } from "@/data/testimonial";
import Marquee from "react-fast-marquee";

export default function TestimonialSection() {
    return (
        <div id="testimonials" className="px-4 md:px-16 lg:px-24 xl:px-32 bg-white pt-8 pb-12">
            <SectionTitle
                text1="Reviews"
                text2="What our guests say"
                text3="Read authentic reviews from travelers who have experienced Brighton Tours. Join hundreds of happy guests who've discovered Brighton's magic."
            />

            {/* Professional marquee with white gradient edges */}
            <Marquee
                className="max-w-5xl mx-auto mt-6"
                gradient={true}
                speed={25}
                gradientColor="255, 255, 255"
                gradientWidth={80}
            >
                <div className="flex items-center justify-center py-5 overflow-hidden">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} index={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>

            <Marquee
                className="max-w-5xl mx-auto"
                gradient={true}
                speed={25}
                direction="right"
                gradientColor="255, 255, 255"
                gradientWidth={80}
            >
                <div className="flex items-center justify-center py-5 overflow-hidden">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} index={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>

            {/* TODO: Add TripAdvisor integration */}
            {/* Consider adding: */}
            {/* - TripAdvisor Certificate of Excellence badge */}
            {/* - Average rating display (e.g., "4.9/5 from 150+ reviews") */}
            {/* - Link to full TripAdvisor profile */}
        </div>
    );
}
