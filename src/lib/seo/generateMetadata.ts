import { i18nConfig } from "@/lib/i18n/i18nConfig";
import { Metadata } from "next";

type MetadataOptions = {
  locale: string;
  translationGroup?: string[];
  baseUrl: string;
  path?: string;
  imageUrl?: string;
  noIndex?: boolean;
  category?: string;
  tags?: string[];
};

export async function generateLocalizedMetadata({
  locale,
  translationGroup,
  baseUrl,
  path = `/${locale}`,
  imageUrl = `${baseUrl}/images/Susa.png`,
  noIndex = false,
  category = "Business Software",
  tags = [],
}: MetadataOptions): Promise<Metadata> {
  const title = "TechBee technology solutions ERP";
  const description =
    "A modern ERP platform tailored for ethiopian enterprises. Seamlessly manage finance, HR, inventory, and operations—all in one place.";

  const baseKeywords = [
    "susa erp",
    "best erp software",
    "ethiopian erp",
    "erp software",
    "erp system ethiopia",
    "best erp for africa",
    "african erp solution",
    "TechBee enterprise solutions",
    "business management ethiopia",
    "inventory management ethiopia",
    "accounting software ethiopia",
    "hr software ethiopia",
    "payroll ethiopia",
    "enterprise software ethiopia",
    "custom erp ethiopia",
    "multi-language erp",
    "local erp provider ethiopia",
    "small business erp",
    "mid-size business erp",
    "erp for NGOs ethiopia",
    "cloud erp ethiopia",
    "affordable erp ethiopia",
  ];

  const localizedKeywords = {
    am: [
      "የኢትዮጵያ ኢንተርፕራይዝ ሶፍትዌር",
      "ኤርፒ ሶፍትዌር",
      "ኤርፒ ኢትዮጵያ",
      "የንግድ አስተዳደር ሶፍትዌር",
      "የእቃ መከታተያ ሶፍትዌር",
      "የሂሳብ ሶፍትዌር",
      "የሰራተኞች አስተዳደር ሶፍትዌር",
      "ሱሳ ቴክኖሎጂ",
    ],
    om: [
      "ERP Itoophiyaa",
      "sofweerii daldalaa",
      "ERP hojii fi maallaqa",
      "ERP dhaabbilee xixiqqoo",
      "ERP dhaabbilee giddu galeessaa",
      "susa technology",
      "ERP Afaan Oromoo",
    ],
  };

  const keywords = [
    ...baseKeywords,
    ...(localizedKeywords[locale as keyof typeof localizedKeywords] || []),
    ...tags,
  ];

  const alternates = {
    canonical: `${baseUrl}${path}`,
    languages: Object.fromEntries(
      i18nConfig.locales.map((lng) => [
        lng,
        `${baseUrl}${
          i18nConfig.prefixDefault || lng !== i18nConfig.defaultLocale
            ? `/${lng}`
            : ""
        }`,
      ])
    ),
  };

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    applicationName: "TechBee ERP",
    authors: [{ name: "TechBee Technology Solutions", url: baseUrl }],
    publisher: "TechBee Technology Solutions",
    generator: "Next.js",
    keywords,
    icons: {
      icon: [
        { url: `${baseUrl}/favicon.ico`, sizes: "any" },
        { url: `${baseUrl}/favicon.svg`, type: "image/svg+xml" },
      ],
      apple: `${baseUrl}/apple-touch-icon.png`,
      shortcut: `${baseUrl}/favicon.ico`,
      other: [
        {
          rel: "apple-touch-startup-image",
          url: `${baseUrl}/images/splash.png`,
        },
      ],
    },
    manifest: `${baseUrl}/site.webmanifest`,
    openGraph: {
      type: "website",
      locale,
      url: `${baseUrl}${path}`,
      siteName: "TechBee ERP",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@TechBeeTech",
      creator: "@TechBeeTech",
      title,
      description,
      images: imageUrl,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
      },
    },
    verification: {
      google: "uTNYr1FhiYBrlj82wnqdZ0OTm0ij0lgVKP1CMmauBus",
    },
    appleWebApp: {
      title: "TechBee ERP",
      statusBarStyle: "black-translucent",
      startupImage: [
        {
          url: `${baseUrl}/images/splash.png`,
          media: "(device-width: 414px) and (device-height: 896px)",
        },
      ],
    },
    alternates,
    archives: [`${baseUrl}/sitemap.xml`],
    category,
  };
}
