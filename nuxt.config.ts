// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  experimental: {
    appManifest: false
  },

  app: {
    head: {
      title: 'Perpustakaan STAH Dharma Nusantara Jakarta',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
      ],
      script: [
        { src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries' },
        {
          id: 'tailwind-config',
          innerHTML: `
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        "colors": {
                            "surface-container-low": "#f2f3f7",
                            "on-primary-container": "#7ea4c9",
                            "surface-dim": "#d9dade",
                            "on-secondary-container": "#755400",
                            "primary-fixed": "#cde5ff",
                            "on-tertiary": "#ffffff",
                            "secondary-fixed-dim": "#f0bf5c",
                            "surface": "#f8f9fd",
                            "on-primary-fixed": "#001d32",
                            "outline-variant": "#c2c7ce",
                            "primary-fixed-dim": "#a3caf1",
                            "tertiary-fixed": "#f5e1b3",
                            "inverse-on-surface": "#eff1f5",
                            "on-error-container": "#93000a",
                            "error-container": "#ffdad6",
                            "surface-container-lowest": "#ffffff",
                            "on-background": "#191c1f",
                            "surface-bright": "#f8f9fd",
                            "on-surface-variant": "#42474e",
                            "on-error": "#ffffff",
                            "on-tertiary-container": "#4b3e1d",
                            "secondary-container": "#fcca66",
                            "secondary-fixed": "#ffdea4",
                            "on-primary": "#ffffff",
                            "surface-variant": "#e1e2e6",
                            "primary-container": "#0a3a5a",
                            "on-primary-fixed-variant": "#204a6b",
                            "surface-container-high": "#e7e8ec",
                            "on-secondary-fixed-variant": "#5d4200",
                            "on-tertiary-fixed": "#241a00",
                            "inverse-primary": "#a3caf1",
                            "surface-tint": "#3a6284",
                            "tertiary-container": "#bcaa7f",
                            "surface-container-highest": "#e1e2e6",
                            "secondary": "#7b5900",
                            "outline": "#72777e",
                            "error": "#ba1a1a",
                            "background": "#f8f9fd",
                            "on-tertiary-fixed-variant": "#534523",
                            "on-secondary": "#ffffff",
                            "tertiary-fixed-dim": "#d8c598",
                            "on-surface": "#191c1f",
                            "on-secondary-fixed": "#261900",
                            "tertiary": "#6b5d39",
                            "surface-container": "#edeef2",
                            "primary": "#00243c",
                            "inverse-surface": "#2e3134"
                        },
                        "borderRadius": {
                            "DEFAULT": "0.25rem",
                            "lg": "0.5rem",
                            "xl": "0.75rem",
                            "full": "9999px"
                        },
                        "spacing": {
                            "gutter": "24px",
                            "margin-mobile": "16px",
                            "unit": "8px",
                            "margin-desktop": "40px",
                            "container-max": "1280px"
                        },
                        "fontFamily": {
                            "caption": ["Inter"],
                            "headline-md": ["Inter"],
                            "body-lg": ["Inter"],
                            "label-md": ["Inter"],
                            "headline-lg-mobile": ["Inter"],
                            "headline-lg": ["Inter"],
                            "body-md": ["Inter"],
                            "display-lg": ["Inter"]
                        },
                        "fontSize": {
                            "caption": ["12px", {"lineHeight": "16px", "fontWeight": "400"}],
                            "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                            "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                            "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                            "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                            "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                            "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                            "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                        }
                    },
                },
            }
          `
        }
      ]
    }
  },

  runtimeConfig: {
    pustakaApiKey: process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api-pustaka.stahdnj.ac.id/api'
    }
  },

  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  modules: ["nitro-cloudflare-dev"]
})
