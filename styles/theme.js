// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Theme & Style Constants
// Reference this when setting up the Wix Editor design
// ─────────────────────────────────────────────────────────────

export const THEME = {
    colors: {
        primary: "#FF6B00",        // BigTaka orange
        primaryDark: "#E05500",
        secondary: "#1A1A2E",      // Dark navy
        accent: "#FFD700",         // Gold
        background: "#F5F5F5",     // Light gray background
        cardBg: "#FFFFFF",
        textPrimary: "#1A1A2E",
        textSecondary: "#555555",
        textLight: "#FFFFFF",
        border: "#E0E0E0",
        success: "#28A745",
        trending: "#FF4444",
        cricket: "#2E7D32",        // Green for cricket
        casino: "#FFD700",         // Gold for casino
        celebrity: "#E91E63",      // Pink for celebrity
        viral: "#FF5722",          // Deep orange for viral
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
    cricket: { bg: "#E8F5E9", text: "#2E7D32", border: "#4CAF50" },
    casino: { bg: "#FFF8E1", text: "#F57F17", border: "#FFD700" },
    celebrity: { bg: "#FCE4EC", text: "#C2185B", border: "#E91E63" },
    viral: { bg: "#FBE9E7", text: "#D84315", border: "#FF5722" },
};
