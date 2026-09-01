import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Building2, Facebook, Instagram, Twitter } from 'lucide-react';
import { home, login, register } from '@/routes';
import { blog as blogHref } from '@/routes/site';

type GlobalSettings = {
    name: string;
    email: string | null;
    facebook_link: string | null;
    instagram_link: string | null;
    twitter_link: string | null;
    meta_description: string | null;
};

export default function SiteLayout({ children }: { children: ReactNode }) {
    const { globalSettings, auth } = usePage().props as {
        globalSettings?: GlobalSettings;
        auth?: { user?: unknown };
    };

    const name = globalSettings?.name ?? 'QNEXUS';

    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            <header className="sticky top-0 z-10 border-b border-black/10 bg-[#FDFDFC]/90 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0a]/90">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 lg:px-8">
                    <Link href={home()} className="flex items-center gap-2 font-semibold">
                        <Building2 className="size-5" />
                        {name}
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href={home()} className="hover:text-muted-foreground">
                            Home
                        </Link>
                        <Link href={blogHref()} className="hover:text-muted-foreground">
                            Blog
                        </Link>
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-md bg-black px-3 py-1.5 text-white dark:bg-white dark:text-black"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="hover:text-muted-foreground">
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-md bg-black px-3 py-1.5 text-white dark:bg-white dark:text-black"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-black/10 py-10 dark:border-white/10">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 lg:flex-row lg:px-8">
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 className="size-4" />
                        <span>
                            © {new Date().getFullYear()} {name}. All rights reserved.
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {globalSettings?.facebook_link && (
                            <a href={globalSettings.facebook_link} target="_blank" rel="noreferrer">
                                <Facebook className="size-4" />
                            </a>
                        )}
                        {globalSettings?.instagram_link && (
                            <a href={globalSettings.instagram_link} target="_blank" rel="noreferrer">
                                <Instagram className="size-4" />
                            </a>
                        )}
                        {globalSettings?.twitter_link && (
                            <a href={globalSettings.twitter_link} target="_blank" rel="noreferrer">
                                <Twitter className="size-4" />
                            </a>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}