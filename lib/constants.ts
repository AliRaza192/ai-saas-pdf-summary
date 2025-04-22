export const pricingPlans = [
  {
    name: "Basic",
    price: 9,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email Support",
    ],
    id: "basic",
    paymentLink:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_00gaGc0ML4ON7aE4gg"
        : "",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1RGKh9CcLrpIxtToxXSm3vwr"
        : "",
  },

  {
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_6oE3dKdzx2GFeD6bIJ"
        : "",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1RGKh9CcLrpIxtToT7Id1mji"
        : "",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};
