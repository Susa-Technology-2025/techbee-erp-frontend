import { Business, CorporateFare, Diamond, Star } from "@mui/icons-material";

export const packages = [
  {
    name: "Starter",
    prices: {
      monthly: "29 Birr",
      yearly: "25 Birr",
    },
    desc: "per user/month",
    icon: <Star color="primary" />,
    features: [
      "Up to 10 users",
      "Basic inventory",
      "Simple accounting",
      "Email support",
      "Standard reports",
    ],
    bestFor: "Small businesses getting started",
    ctaText: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Professional",
    prices: {
      monthly: "79 Birr",
      yearly: "69 Birr",
    },
    desc: "per user/month",
    icon: <Business color="primary" />,
    features: [
      "Up to 50 users",
      "Advanced inventory",
      "Full accounting suite",
      "Priority support",
      "Custom reports",
      "API access",
    ],
    bestFor: "Growing businesses",
    ctaText: "Most Popular",
    highlight: true,
  },
  {
    name: "Enterprise",
    prices: {
      monthly: "149 Birr",
      yearly: "129 Birr",
    },
    desc: "per user/month",
    icon: <CorporateFare color="primary" />,
    features: [
      "Unlimited users",
      "Multi-location inventory",
      "Advanced analytics",
      "24/7 support",
      "Dedicated account manager",
      "Custom integrations",
      "HR module included",
    ],
    bestFor: "Large organizations",
    ctaText: "Contact Sales",
    highlight: false,
  },
  {
    name: "Custom",
    prices: {
      monthly: "Custom",
      yearly: "Custom",
    },
    desc: "Tailored solution",
    icon: <Diamond color="primary" />,
    features: [
      "Fully customizable",
      "White-label options",
      "On-premise deployment",
      "Training included",
      "SLA guarantees",
      "Dedicated engineering",
    ],
    bestFor: "Special requirements",
    ctaText: "Get a Quote",
    highlight: false,
  },
];
