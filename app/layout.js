import { Poppins } from "next/font/google";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata = {
    metadataBase: new URL('https://brighton-tours.co.uk'),
    title: {
        default: 'Brighton Tours | Free Walking Tours & Pub Crawls with Niko the Nomad',
        template: '%s | Brighton Tours'
    },
    description: 'Join free walking tours of Brighton with expert local guide Niko the Nomad. Explore Royal Pavilion, Palace Pier, The Lanes, North Laine & more. Plus weeknight pub crawls Sunday-Thursday.',
    keywords: [
        'free walking tours brighton',
        'brighton walking tours',
        'walking tours brighton',
        'brighton tours',
        'brighton pub crawls',
        'brighton pub crawl',
        'free tours brighton',
        'niko the nomad',
        'brighton tour guide',
        'royal pavilion tours',
        'brighton palace pier',
        'the lanes brighton',
        'brighton city tours',
        'weeknight pub crawl brighton',
        'things to do brighton',
        'brighton attractions',
        'brighton sightseeing'
    ],
    authors: [{ name: 'Niko the Nomad' }],
    creator: 'Brighton Tours',
    publisher: 'Brighton Tours',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_GB',
        url: 'https://brighton-tours.co.uk',
        siteName: 'Brighton Tours',
        title: 'Brighton Tours | Free Walking Tours & Pub Crawls',
        description: 'Free walking tours of Brighton\'s iconic landmarks with expert guide Niko the Nomad. Royal Pavilion, Palace Pier, The Lanes & weeknight pub crawls.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Brighton Tours - Free Walking Tours with Niko the Nomad',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Brighton Tours | Free Walking Tours & Pub Crawls',
        description: 'Free walking tours of Brighton with Niko the Nomad. Explore iconic landmarks & join weeknight pub crawls.',
        images: ['/og-image.jpg'],
        creator: '@brightontours',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'google-site-verification-code',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en-GB">
            <head>
                <link rel="preload" href="/assets/background-splash.svg" as="image" />
                <link rel="canonical" href="https://brighton-tours.co.uk" />
                <meta name="geo.region" content="GB-BNH" />
                <meta name="geo.placename" content="Brighton" />
                <meta name="geo.position" content="50.82838;-0.13947" />
                <meta name="ICBM" content="50.82838, -0.13947" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "TouristAttraction",
                                    "@id": "https://brighton-tours.co.uk/#organization",
                                    "name": "Brighton Tours",
                                    "alternateName": "Brighton Free Walking Tours",
                                    "url": "https://brighton-tours.co.uk",
                                    "logo": "https://brighton-tours.co.uk/logo.png",
                                    "description": "Free walking tours and pub crawls in Brighton, UK led by expert local guide Niko the Nomad with 4 years of experience.",
                                    "address": {
                                        "@type": "PostalAddress",
                                        "addressLocality": "Brighton",
                                        "addressRegion": "East Sussex",
                                        "addressCountry": "GB"
                                    },
                                    "geo": {
                                        "@type": "GeoCoordinates",
                                        "latitude": "50.82838",
                                        "longitude": "-0.13947"
                                    },
                                    "priceRange": "Free (tips welcome)",
                                    "touristType": ["Tourists", "Backpackers", "Solo Travelers", "Groups"],
                                    "availableLanguage": ["en"],
                                },
                                {
                                    "@type": "LocalBusiness",
                                    "@id": "https://brighton-tours.co.uk/#business",
                                    "name": "Brighton Tours",
                                    "image": "https://brighton-tours.co.uk/logo.png",
                                    "address": {
                                        "@type": "PostalAddress",
                                        "streetAddress": "Brighton City Centre",
                                        "addressLocality": "Brighton",
                                        "addressRegion": "East Sussex",
                                        "postalCode": "BN1",
                                        "addressCountry": "GB"
                                    },
                                    "geo": {
                                        "@type": "GeoCoordinates",
                                        "latitude": "50.82838",
                                        "longitude": "-0.13947"
                                    },
                                    "url": "https://brighton-tours.co.uk",
                                    "telephone": "+44-XXX-XXX-XXXX",
                                    "priceRange": "Free-£40",
                                    "openingHoursSpecification": [
                                        {
                                            "@type": "OpeningHoursSpecification",
                                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                                            "opens": "09:00",
                                            "closes": "23:00"
                                        }
                                    ],
                                    "servesCuisine": "British Pub Food",
                                    "aggregateRating": {
                                        "@type": "AggregateRating",
                                        "ratingValue": "5",
                                        "reviewCount": "100"
                                    }
                                },
                                {
                                    "@type": "Product",
                                    "name": "Free Walking Tour Brighton",
                                    "description": "2-3 hour guided walking tour of Brighton's iconic landmarks including Royal Pavilion, Palace Pier, British Airways i360, The Lanes, and North Laine. Tips-based, no fixed price.",
                                    "brand": {
                                        "@type": "Brand",
                                        "name": "Brighton Tours"
                                    },
                                    "offers": {
                                        "@type": "Offer",
                                        "price": "0",
                                        "priceCurrency": "GBP",
                                        "availability": "https://schema.org/InStock",
                                        "url": "https://brighton-tours.co.uk/#pricing"
                                    },
                                    "aggregateRating": {
                                        "@type": "AggregateRating",
                                        "ratingValue": "5",
                                        "reviewCount": "100"
                                    }
                                },
                                {
                                    "@type": "Product",
                                    "name": "Brighton Weeknight Pub Crawl",
                                    "description": "Weeknight pub crawl in Brighton running Sunday to Thursday. Visit 4-5 best Brighton pubs with local guide, includes welcome drink and drinking games.",
                                    "brand": {
                                        "@type": "Brand",
                                        "name": "Brighton Tours"
                                    },
                                    "offers": {
                                        "@type": "Offer",
                                        "price": "15",
                                        "priceCurrency": "GBP",
                                        "availability": "https://schema.org/InStock",
                                        "url": "https://brighton-tours.co.uk/#pricing"
                                    }
                                },
                                {
                                    "@type": "Person",
                                    "name": "Niko the Nomad",
                                    "jobTitle": "Tour Guide",
                                    "description": "Expert local tour guide with 4 years of experience leading walking tours and pub crawls in Brighton.",
                                    "worksFor": {
                                        "@type": "Organization",
                                        "name": "Brighton Tours"
                                    }
                                }
                            ]
                        })
                    }}
                />
            </head>
            <body>
                <LenisScroll />
                {children}
            </body>
        </html>
    );
}