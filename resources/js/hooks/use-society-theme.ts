import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

type Tenancy = {
    society?: {
        theme_hex?: string | null;
        theme_rgb?: string | null;
    } | null;
};

const THEME_VARS = [
    '--primary',
    '--sidebar-primary',
    '--ring',
    '--sidebar-ring',
    '--focus',
    '--chart-1',
] as const;

/**
 * Applies the active society's white-label brand colour to the app shell at
 * runtime by overriding the shadcn CSS custom properties (e.g. --primary,
 * --sidebar-primary) on the document root. When no society colour is set the
 * platform defaults (defined in app.css) are left untouched.
 */
export function useSocietyTheme() {
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as Tenancy;
    const themeHex = tenancy.society?.theme_hex;

    useEffect(() => {
        if (!themeHex) {
            return;
        }

        const root = document.documentElement;

        for (const variable of THEME_VARS) {
            root.style.setProperty(variable, themeHex);
        }

        return () => {
            for (const variable of THEME_VARS) {
                root.style.removeProperty(variable);
            }
        };
    }, [themeHex]);
}
