export const PLANS = [
    {
        id: "free",
        name: "Free",
        price: 0,
        priceId: "",
        features: [
            "1 Video Synthesis/month",
            "Standard PDF Extraction",
            "Community Voice Over",
            "Community Support",
        ],
        cta: "Current Plan",
        featured: false,
    },
    {
        id: "pro",
        name: "Professional",
        price: 29,
        priceId: "price_PRO_ID_HERE", // User needs to replace
        features: [
            "20 Video Syntheses/month",
            "High-Priority AI Processing",
            "Premium Voice Over Access",
            "Export to MP4 (1080p)",
            "Priority Email Support",
        ],
        cta: "Upgrade to Pro",
        featured: true,
    },
    {
        id: "unlimited",
        name: "Enterprise",
        price: 99,
        priceId: "price_ENTERPRISE_ID_HERE", // User needs to replace
        features: [
            "Unlimited Video Synthesis",
            "Custom Brand Integration",
            "Advanced Visual Effects",
            "API Access (Early Beta)",
            "Dedicated Success Manager",
        ],
        cta: "Go Unlimited",
        featured: false,
    },
];
