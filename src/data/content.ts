export const siteConfig = {
  name: "Hashstack",
  fullName: "Hashstack Developers",
  tagline: "A full-service technology company — built on today’s stack, tuned for speed.",
  description:
    "Hashstack Developers is a full-service technology company. We design, build, and grow digital products — websites, mobile apps, UI/UX, cloud, AI, branding, and ongoing product care — for startups and established brands that need one partner for the whole journey.",
  email: "hashstackdevelopers@gmail.com",
  phone: "+92 321 000 6260",
  /** Digits only, country code, for wa.me links */
  whatsapp: "923210006260",
  location: "Global · Remote-first",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/play", label: "Play" },
  { href: "/contact", label: "Contact" },
];

export const stats = [
  { value: 180, suffix: "+", label: "Projects shipped", detail: "Web, apps, brand & cloud" },
  { value: 98, suffix: "%", label: "Client retention", detail: "Partners who stay for years" },
  { value: 40, suffix: "+", label: "Global clients", detail: "Startups to enterprise" },
  { value: 3, suffix: "×", label: "Faster launches", detail: "Vs. our legacy stack era" },
];

export const services = [
  {
    id: "web",
    title: "Web Development",
    subtitle: "Next.js · React · Edge",
    description:
      "Fast marketing sites, product web apps, and scroll-driven experiences on modern frameworks — SEO-ready, edge-deployed, and built to load in a blink.",
    icon: "Globe",
    accent: "#ca8a04",
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    subtitle: "iOS · Android · Cross-platform",
    description:
      "Store-ready iOS and Android apps with React Native or Flutter — polished gestures, offline-friendly flows, and release pipelines your team can trust.",
    icon: "Smartphone",
    accent: "#ca8a04",
  },
  {
    id: "design",
    title: "UI/UX & Product Design",
    subtitle: "Systems · Prototypes · Research",
    description:
      "From discovery workshops to design systems and hi-fi prototypes — interfaces people understand on the first tap, with motion specs that survive engineering.",
    icon: "Palette",
    accent: "#ca8a04",
  },
  {
    id: "graphics",
    title: "Graphics & Brand Motion",
    subtitle: "Identity · Social · Campaign",
    description:
      "Brand systems, campaign creatives, social kits, and motion graphics that keep your story consistent across web, app, and ads.",
    icon: "PenTool",
    accent: "#ca8a04",
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    subtitle: "AWS · GCP · CI/CD",
    description:
      "Infrastructure that scales with you — containers, pipelines, monitoring, and zero-drama releases so shipping never feels like a gamble.",
    icon: "Cloud",
    accent: "#ca8a04",
  },
  {
    id: "ai",
    title: "AI & Automation",
    subtitle: "LLMs · Agents · Workflows",
    description:
      "Production AI features — copilots, content pipelines, chat, and internal automation — with observability and guardrails from day one.",
    icon: "Sparkles",
    accent: "#ca8a04",
  },
];

export const techStack = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Three.js", category: "Frontend" },
  { name: "GSAP", category: "Frontend" },
  { name: "Tailwind", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "GraphQL", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "Redis", category: "Backend" },
  { name: "Prisma", category: "Backend" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "Cloud" },
  { name: "Kubernetes", category: "Cloud" },
  { name: "Vercel", category: "Cloud" },
  { name: "OpenAI", category: "AI" },
  { name: "LangChain", category: "AI" },
  { name: "TensorFlow", category: "AI" },
  { name: "Hugging Face", category: "AI" },
];

export const whyUs = [
  {
    title: "One partner. Every surface.",
    body: "Web, mobile, design, graphics, cloud, and AI under one roof — so your product doesn’t get lost between five vendors.",
  },
  {
    title: "Built on today’s stack",
    body: "We retired the slow legacy site era. This platform runs on modern frameworks, edge delivery, and performance budgets from sprint one.",
  },
  {
    title: "Immersive when it earns it",
    body: "Motion, 3D, and scroll storytelling when they sell the story — engineered for 60fps and respectful of reduced-motion preferences.",
  },
  {
    title: "Ship, measure, keep going",
    body: "Launch with analytics and care plans baked in. We stay for iteration, not just the go-live party.",
  },
];

export const projects = [
  {
    id: "aurora",
    title: "Aurora Commerce",
    category: "Web",
    year: "2025",
    metric: "+142% conversion",
    description:
      "Full rebuild of a heavy legacy storefront into a fast Next.js experience with 3D product views and edge personalization.",
    gradient: "from-gold/30 via-black to-gold/10",
  },
  {
    id: "pulse",
    title: "Pulse Health",
    category: "Mobile",
    year: "2025",
    metric: "4.9★ store rating",
    description: "Clinical telehealth app with realtime vitals, secure chat, and care-team dashboards — design through store launch.",
    gradient: "from-gold/25 via-black to-cream/5",
  },
  {
    id: "nexus",
    title: "Nexus Ops",
    category: "SaaS",
    year: "2024",
    metric: "12k daily active",
    description: "Ops control plane with WebGL topology maps, AI incident summaries, and a design system the client now owns.",
    gradient: "from-gold/20 via-black to-gold/15",
  },
  {
    id: "velvet",
    title: "Velvet Studio",
    category: "Brand · AI",
    year: "2024",
    metric: "8M assets generated",
    description: "Creator suite plus brand motion system — generative edits, captions, and campaign kits for social-first brands.",
    gradient: "from-cream/10 via-black to-gold/20",
  },
  {
    id: "orbit",
    title: "Orbit Finance",
    category: "Web · Cloud",
    year: "2024",
    metric: "$2.1B volume",
    description: "Institutional trading terminal with kinetic data viz, hardened cloud infra, and sub-100ms update paths.",
    gradient: "from-gold/30 via-black to-black",
  },
];

export const testimonials = [
  {
    quote:
      "Hashstack didn’t just redesign our site — they replaced a slow legacy stack with something that finally feels as sharp as our brand. Demo bookings jumped in the first month.",
    name: "Maya Chen",
    role: "CMO, Aurora Commerce",
  },
  {
    quote:
      "One team owned design, mobile, and our AI copilot. Eight weeks to production — stable, observable, and loved by support from day one.",
    name: "Jordan Blake",
    role: "VP Engineering, Pulse Health",
  },
  {
    quote:
      "Rare to find a technology partner that can do brand motion, product UI, and backend with equal rigor. Our launch felt like a film — and a product.",
    name: "Sofia Reyes",
    role: "Founder, Nexus Ops",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    body: "Workshops, audits, and success metrics — we learn the business before we touch the stack.",
  },
  {
    step: "02",
    title: "Design",
    body: "Systems, prototypes, and motion specs validated with real users and stakeholder reviews.",
  },
  {
    step: "03",
    title: "Build",
    body: "Agile sprints on modern stacks with CI/CD, performance budgets, and weekly demos.",
  },
  {
    step: "04",
    title: "Launch",
    body: "Hardening, analytics, and go-live runbooks — then we stay on-call when it matters.",
  },
  {
    step: "05",
    title: "Grow",
    body: "Iteration on conversion, SEO, new features, and care — long after the champagne.",
  },
];

export const team = [
  { name: "Alex Rivera", role: "Creative Director", focus: "Motion · Brand" },
  { name: "Priya Nair", role: "Head of Engineering", focus: "Platform · Scale" },
  { name: "Leo Park", role: "3D Lead", focus: "R3F · WebGL" },
  { name: "Sam Okonkwo", role: "AI Lead", focus: "Agents · MLOps" },
];

export const values = [
  {
    title: "Craft over noise",
    body: "Every interaction earns its place. No empty animation, no bloated pages.",
  },
  {
    title: "Speed is a feature",
    body: "We left slow legacy builds behind. Load time, Core Web Vitals, and DX are part of the brief.",
  },
  {
    title: "Partners, not vendors",
    body: "Embedded teams that care about your roadmap and your P&L — not just the invoice.",
  },
  {
    title: "Accessibility always",
    body: "Reduced motion, contrast, and keyboard paths by default — inclusive from the first commit.",
  },
];

/** Shared hero / film copy — used on Home and reusable elsewhere. */
export const heroCopy = {
  eyebrow: siteConfig.fullName,
  titleLine1: "Build what’s",
  titleLine2: "next.",
  mobileLead:
    "Full-service technology company — websites, apps, design, graphics, cloud & AI. Modern stack. Built to feel fast.",
  desktopLead:
    "From brand to backend: we ship every surface your product needs — on today’s frameworks, with cinema-grade craft.",
  primaryCta: "Start a project",
  secondaryCta: "Explore the reel",
  acts: [
    {
      label: "Act II",
      title: "Every service. One stack.",
      body: "Web, mobile, design, graphics, cloud, and AI — planned as one roadmap, not five disconnected agencies.",
    },
    {
      label: "Act III",
      title: "Faster than the old web",
      body: "We rebuilt past the slow legacy era. Edge delivery, lean bundles, and stacks that keep up with your users.",
    },
    {
      label: "Act IV",
      title: "Ship what lasts",
      body: "Launch day is the midpoint. Care, iteration, and measurable growth keep the product alive.",
    },
  ],
  endTitle: "Ready when you are.",
  endCta: "Book discovery",
};

export const aboutStory = {
  title: "A technology company for every digital surface.",
  description:
    "Hashstack Developers started as a craft-driven studio. Years later we rebuilt our own platform on the latest stacks — because the old site was slow, heavy, and no longer matched how we ship for clients. Today we’re a full-service partner: strategy, design, engineering, cloud, and AI under one roof.",
  timeline: [
    {
      year: "≈3 yrs",
      title: "The first Hashstack site",
      body: "Our early web presence got the job done — until load times and an aging stack held the brand back.",
    },
    {
      year: "Rebuild",
      title: "Latest stacks, same ambition",
      body: "We tore down the slow path and rebuilt on Next.js, modern motion, and performance-first delivery.",
    },
    {
      year: "Today",
      title: "Full-service delivery",
      body: "Web, mobile, UI/UX, graphics, cloud, AI, and ongoing product care — one team for the whole product.",
    },
    {
      year: "Next",
      title: "Still craft-obsessed",
      body: "Global remote, still hands-on. Cinema when it earns attention. Speed when users need it.",
    },
  ],
};

export type CalculatorOption = {
  label: string;
  /** Extra USD on top of basePrice — ignored when quoteOnly */
  price: number;
  /** Medium/large work: no public price, contact for quote */
  quoteOnly?: boolean;
  timeline?: string;
  hint?: string;
};

export type CalculatorStep = {
  id: string;
  title: string;
  options: CalculatorOption[];
};

export type CalculatorCurrency = "USD" | "PKR";

/**
 * Project calculator — amounts in USD.
 * Public prices only under quoteAbovePkr (~Rs 50k). Larger deals → contact.
 */
export const calculatorPricing: {
  basePrice: number;
  defaultCurrency: CalculatorCurrency;
  /** Rough mid-market rate — tweak anytime */
  usdToPkr: number;
  /** Deals at/above this PKR amount show “Contact for quote” */
  quoteAbovePkr: number;
  steps: CalculatorStep[];
} = {
  // Domain / coming-soon is included in base
  basePrice: 42,
  defaultCurrency: "USD",
  usdToPkr: 278,
  quoteAbovePkr: 50_000,
  steps: [
    {
      id: "type",
      title: "What are we building?",
      options: [
        {
          label: "Domain / coming-soon page",
          price: 0,
          timeline: "1–3 days",
          hint: "Just get online — park the domain",
        },
        {
          label: "Simple 1-page site",
          price: 50,
          timeline: "3–7 days",
          hint: "One clean page · contact + links",
        },
        {
          label: "Small brochure website",
          price: 130,
          timeline: "1–2 weeks",
          hint: "About, services, contact",
        },
        {
          label: "Business / marketing site",
          price: 254,
          quoteOnly: true,
          hint: "Multi-page · SEO-ready — custom quote",
        },
        {
          label: "Brand / graphics pack",
          price: 104,
          timeline: "1–2 weeks",
          hint: "Logo kit, social, basics",
        },
        {
          label: "UI/UX design only",
          price: 112,
          timeline: "1–3 weeks",
          hint: "Screens + prototype",
        },
        {
          label: "Simple online store",
          price: 585,
          quoteOnly: true,
          hint: "Catalog + cart — custom quote",
        },
        {
          label: "Full e-commerce",
          price: 0,
          quoteOnly: true,
          hint: "Payments, inventory, admin — custom quote",
        },
        {
          label: "Web app / SaaS",
          price: 0,
          quoteOnly: true,
          hint: "Accounts, dashboards, APIs — custom quote",
        },
        {
          label: "Mobile app (iOS / Android)",
          price: 0,
          quoteOnly: true,
          hint: "Store-ready build — custom quote",
        },
        {
          label: "AI feature / chatbot",
          price: 0,
          quoteOnly: true,
          hint: "Copilot, chat, automation — custom quote",
        },
        {
          label: "Full digital rebuild",
          price: 0,
          quoteOnly: true,
          hint: "Replace a slow legacy stack — custom quote",
        },
      ],
    },
  ],
};

/** True when a USD amount converts to ≥ quoteAbovePkr */
export function isQuoteAbovePublicPrice(usd: number) {
  return Math.round(usd * calculatorPricing.usdToPkr) >= calculatorPricing.quoteAbovePkr;
}
