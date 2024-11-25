import { useEffect, useState } from 'react';

const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
] as const;

type Theme = typeof themes[number]['value'];

export default function ThemeSelector() {
    const [currentTheme, setCurrentTheme] = useState<Theme>('system');

    useEffect(() => {
        // Initialize theme
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('system');
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (!localStorage.getItem('theme')) {
                setTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const setTheme = (theme: Theme) => {
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.dataset.theme = systemTheme;
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(systemTheme);
            localStorage.removeItem('theme');
        } else {
            document.documentElement.dataset.theme = theme;
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
        setCurrentTheme(theme);
    };

    return (
        <div className="dropdown">
            <label className="btn btn-ghost" tabIndex={0}>
                {currentTheme === 'dark' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                )}
                {currentTheme === 'light' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
                {currentTheme === 'system' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )}
            </label>
            <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 shadow bg-base-200 rounded-box">
                {themes.map(({ value, label }) => (
                    <li key={value}>
                        <button 
                            onClick={() => setTheme(value)}
                            className={currentTheme === value ? 'active' : ''}
                        >
                            {label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}