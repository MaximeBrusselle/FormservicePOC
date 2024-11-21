/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                "accent-light": "rgb(var(--accent-light))",
            },
            backgroundImage: {
                "accent-gradient": "var(--accent-gradient)",
            },
        },
        variants: {
            extend: {
                backgroundImage: ["hover", "focus"],
            },
        },
    },
    plugins: [],
};
