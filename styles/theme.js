// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Theme & Style Constants
// Reference this when setting up the Wix Editor design
// ─────────────────────────────────────────────────────────────

export const THEME = {
    colors: {
        primary: "#500ecf",        // BigTaka purple
        primaryDark: "#3a0a94",
        secondary: "#89eb16",      // Neon green
        secondary2: "#ff1ed7",     // Hot pink
        accent: "#FFD700",         // Gold
        background: "#100525",     // Deep dark purple background
        cardBg: "#FFFFFF",
        lightBg: "#F5F5F5",       // Light sections
        textPrimary: "#100525",
        textSecondary: "#555555",
        textLight: "#FFFFFF",
        border: "#2a1045",
        success: "#89eb16",
        trending: "#ff1ed7",
        cricket: "#89eb16",        // Neon green for cricket
        casino: "#FFD700",         // Gold for casino
        celebrity: "#ff1ed7",      // Hot pink for celebrity
        viral: "#500ecf",          // Purple for viral
    },

    fonts: {
        // Bengali: Use "Noto Sans Bengali" or "Hind Siliguri" (Google Fonts)
        // English: Use "Inter" or "Roboto" (Google Fonts)
        headingBn: "Hind Siliguri, sans-serif",
        headingEn: "Inter, sans-serif",
        bodyBn: "Noto Sans Bengali, sans-serif",
        bodyEn: "Inter, sans-serif",
    },

    fontSizes: {
        heroTitle: "36px",
        h1: "28px",
        h2: "24px",
        h3: "20px",
        body: "16px",
        small: "14px",
        caption: "12px",
    },

    spacing: {
        sectionGap: "48px",
        cardGap: "24px",
        innerPadding: "16px",
    },

    borderRadius: {
        card: "12px",
        button: "8px",
        badge: "20px",
        image: "8px",
    },

    shadows: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        cardHover: "0 4px 16px rgba(0,0,0,0.12)",
        header: "0 2px 4px rgba(0,0,0,0.1)",
    },
};

/**
 * Category-specific color mapping for badges/labels
 */
export const CATEGORY_COLORS = {
    cricket: { bg: "#e8ffc7", text: "#4a8500", border: "#89eb16" },
    casino: { bg: "#FFF8E1", text: "#b8860b", border: "#FFD700" },
    celebrity: { bg: "#ffe6f9", text: "#c4009e", border: "#ff1ed7" },
    viral: { bg: "#ede0ff", text: "#500ecf", border: "#7b3fe0" },
};
