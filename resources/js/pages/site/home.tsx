import { Head, Link, usePage } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    Calendar,
    CreditCard,
    Facebook,
    Instagram,
    LogIn,
    Megaphone,
    ShieldCheck,
    Sparkles,
    Twitter,
    Users,
    Wrench,
    Zap,
} from 'lucide-react';
import { login, register } from '@/routes';
import { post as postHref } from '@/routes/site';

type CmsSection = {
    id: number;
    name: string;
    section_type: string;
    heading: string | null;
    subheading: string | null;
    body: string | null;
    image: string | null;
    button_text: string | null;
    button_link: string | null;
};

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    published_at: string | null;
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } },
};

const moduleList: { icon: any; title: string; description: string; color: string }[] = [
    { icon: Building2, title: 'Property & Organization', description: 'Towers, units, parking, common areas, and facilities in one structured hierarchy.', color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
    { icon: Users, title: 'Residents & Visitors', description: 'Owner, tenant and family profiles with visitor management and QR invitations.', color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { icon: ShieldCheck, title: 'Security & Access', description: 'QR-based access, gate passes, patrol logs and boom barrier integration.', color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
    { icon: Wrench, title: 'Amenities & Services', description: 'Bookable amenities, service management, vendors and maintenance tracking.', color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
    { icon: CreditCard, title: 'Finance & Billing', description: 'Maintenance, budgets, ledger, invoices and payment capture.', color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' },
    { icon: Megaphone, title: 'Community', description: 'Notices, events, polls and meetings to keep everyone informed.', color: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' },
];

const steps = [
    { num: '01', title: 'Set Up Your Property', description: 'Register your society, add buildings, towers, floors and units in minutes.' },
    { num: '02', title: 'Invite Residents & Staff', description: 'Add owners, tenants, guards and managers with role-based access.' },
    { num: '03', title: 'Manage Everything', description: 'Handle visitors, billing, complaints, amenities and community life from one dashboard.' },
];

const stats = [
    { value: '500+', label: 'Societies' },
    { value: '50,000+', label: 'Residents' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
];

export default function SiteHome({ sections, posts }: { sections: CmsSection[]; posts: Post[] }) {
    const { globalSettings } = usePage().props as {
        globalSettings?: {
            name?: string;
            meta_description?: string | null;
            facebook_link?: string | null;
            instagram_link?: string | null;
            twitter_link?: string | null;
        };
    };

    const hero = sections.find((s) => s.section_type === 'hero');
    const siteName = globalSettings?.name ?? 'QNEXUS';

    return (
        <>
            <Head title={siteName}>
                {globalSettings?.meta_description && (
                    <meta name="description" content={globalSettings.meta_description} />
                )}
            </Head>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <Sparkles className="size-5 text-primary" />
                        {siteName}
                    </Link>
                    <div className="hidden items-center gap-8 md:flex">
                        <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">Features</a>
                        <a href="#how-it-works" className="text-sm text-muted-foreground transition hover:text-foreground">How It Works</a>
                        {posts.length > 0 && (
                            <a href="#blog" className="text-sm text-muted-foreground transition hover:text-foreground">Blog</a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={login()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                        >
                            <LogIn className="size-3.5" />
                            Sign In
                        </Link>
                        <Link
                            href={register()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
                        >
                            Get Started
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-28 text-center lg:px-8 lg:py-36">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                            <Zap className="size-3" />
                            Connected Communities. Smarter Management.
                        </span>
                    </motion.div>
                    <motion.h1
                        className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {hero?.heading ?? 'Intelligent Community & Commercial Management'}
                    </motion.h1>
                    <motion.p
                        className="mt-6 max-w-2xl text-lg text-muted-foreground"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        {hero?.subheading ??
                            'QNEXUS connects people, property, security, services and operations in one intelligent community experience.'}
                    </motion.p>
                    <motion.div
                        className="mt-10 flex items-center gap-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link
                            href={register()}
                            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
                        >
                            {hero?.button_text ?? 'Get started'}
                            <ArrowRight className="size-4" />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-6 py-3 text-sm font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                        >
                            Explore features
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-black/5 bg-black/[0.02] py-12 dark:border-white/5 dark:bg-white/[0.02]">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:px-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24">
                <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything a community needs</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            From estates and towers to finance and community life — QNEXUS brings it all
                            together on one platform.
                        </p>
                    </motion.div>
                    <motion.div
                        className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={stagger}
                    >
                        {moduleList.map(({ icon: Icon, title, description, color }) => (
                            <motion.div
                                key={title}
                                variants={fadeInUp}
                                className="group rounded-2xl border border-black/5 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:hover:shadow-white/5"
                            >
                                <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl ${color}`}>
                                    <Icon className="size-5" />
                                </div>
                                <h3 className="font-semibold">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="border-y border-black/5 bg-black/[0.02] py-24 dark:border-white/5 dark:bg-white/[0.02]">
                <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Get your community online in three simple steps.
                        </p>
                    </motion.div>
                    <motion.div
                        className="mt-14 grid gap-8 md:grid-cols-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={stagger}
                    >
                        {steps.map((step) => (
                            <motion.div key={step.num} variants={fadeInUp} className="relative text-center">
                                <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CMS Sections */}
            {sections
                .filter((s) => s.section_type !== 'hero' && s.section_type !== 'features')
                .map((section) => (
                    <section key={section.id} className="py-20">
                        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                            <h2 className="text-3xl font-bold">{section.heading ?? section.name}</h2>
                            {section.subheading && (
                                <p className="mt-3 text-muted-foreground">{section.subheading}</p>
                            )}
                            {section.body && (
                                <div className="mt-4 max-w-3xl whitespace-pre-line text-muted-foreground">
                                    {section.body}
                                </div>
                            )}
                            {section.button_text && (
                                <Link
                                    href={section.button_link ?? '#'}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
                                >
                                    {section.button_text}
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            )}
                        </div>
                    </section>
                ))}

            {/* Blog */}
            {posts.length > 0 && (
                <section id="blog" className="border-y border-black/5 py-24 dark:border-white/5">
                    <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                        <motion.div
                            className="flex items-end justify-between"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">From the blog</h2>
                                <p className="mt-2 text-muted-foreground">Latest news and updates from QNEXUS.</p>
                            </div>
                            <Link href="/blog" className="hidden text-sm font-medium text-primary hover:underline md:inline-flex items-center gap-1">
                                View all <ArrowRight className="size-3.5" />
                            </Link>
                        </motion.div>
                        <motion.div
                            className="mt-10 grid gap-6 md:grid-cols-3"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={stagger}
                        >
                            {posts.map((post) => (
                                <motion.div key={post.id} variants={fadeInUp}>
                                    <Link
                                        href={postHref(post.slug).url}
                                        className="group block rounded-2xl border border-black/5 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:hover:shadow-white/5"
                                    >
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="size-3" />
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString()
                                                : 'Unpublished'}
                                        </div>
                                        <h3 className="mt-3 font-semibold transition group-hover:text-primary">{post.title}</h3>
                                        {post.excerpt && (
                                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                        <Link href="/blog" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline md:hidden">
                            View all posts <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24">
                <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-8 py-16 text-center text-primary-foreground md:px-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="relative">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to modernize your society?</h2>
                            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                                Join hundreds of communities already using QNEXUS to manage their properties intelligently.
                            </p>
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:opacity-90"
                                >
                                    Start with QNEXUS
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-xl border border-background/30 px-6 py-3 text-sm font-medium transition hover:bg-background/10"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02]">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4 lg:px-8">
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                            <Sparkles className="size-5 text-primary" />
                            {siteName}
                        </Link>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Connected Communities. Smarter Management.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            {globalSettings?.facebook_link && (
                                <a href={globalSettings.facebook_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition hover:text-foreground">
                                    <Facebook className="size-4" />
                                </a>
                            )}
                            {globalSettings?.instagram_link && (
                                <a href={globalSettings.instagram_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition hover:text-foreground">
                                    <Instagram className="size-4" />
                                </a>
                            )}
                            {globalSettings?.twitter_link && (
                                <a href={globalSettings.twitter_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition hover:text-foreground">
                                    <Twitter className="size-4" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold">Product</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li><a href="#features" className="transition hover:text-foreground">Features</a></li>
                            <li><a href="#how-it-works" className="transition hover:text-foreground">How It Works</a></li>
                            <li><Link href={register()} className="transition hover:text-foreground">Get Started</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold">Community</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {posts.length > 0 && <li><Link href="/blog" className="transition hover:text-foreground">Blog</Link></li>}
                            <li><a href="#" className="transition hover:text-foreground">Documentation</a></li>
                            <li><a href="#" className="transition hover:text-foreground">Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold">Legal</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="transition hover:text-foreground">Privacy Policy</a></li>
                            <li><a href="#" className="transition hover:text-foreground">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-black/5 dark:border-white/5">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
                        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
                        <p className="text-xs text-muted-foreground">A QODEIGENCE Product</p>
                    </div>
                </div>
            </footer>
        </>
    );
}