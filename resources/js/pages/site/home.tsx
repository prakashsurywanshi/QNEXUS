import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CreditCard,
    Megaphone,
    ShieldCheck,
    Users,
    Wrench,
} from 'lucide-react';
import { register } from '@/routes';
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

const moduleList: { icon: any; title: string; description: string }[] = [
    { icon: Building2, title: 'Property & Organization', description: 'Towers, units, parking, common areas, and facilities in one structured hierarchy.' },
    { icon: Users, title: 'Residents & Visitors', description: 'Owner, tenant and family profiles with visitor management and QR invitations.' },
    { icon: ShieldCheck, title: 'Security & Access', description: 'QR-based access, gate passes, patrol logs and boom barrier integration.' },
    { icon: Wrench, title: 'Amenities & Services', description: 'Bookable amenities, service management, vendors and maintenance tracking.' },
    { icon: CreditCard, title: 'Finance & Billing', description: 'Maintenance, budgets, ledger, invoices and payment capture.' },
    { icon: Megaphone, title: 'Community', description: 'Notices, events, polls and meetings to keep everyone informed.' },
];

export default function SiteHome({ sections, posts }: { sections: CmsSection[]; posts: Post[] }) {
    const { globalSettings } = usePage().props as {
        globalSettings?: { name?: string; meta_description?: string | null };
    };

    const hero = sections.find((s) => s.section_type === 'hero');

    return (
        <>
            <Head title={globalSettings?.name ?? 'QNEXUS'}>
                {globalSettings?.meta_description && (
                    <meta name="description" content={globalSettings.meta_description} />
                )}
            </Head>

            <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center lg:px-8">
                <span className="mb-4 rounded-full border border-black/10 px-3 py-1 text-xs text-muted-foreground dark:border-white/10">
                    Connected Communities. Smarter Management.
                </span>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                    {hero?.heading ?? 'Intelligent Community & Commercial Management'}
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                    {hero?.subheading ??
                        'QNEXUS connects people, property, security, services and operations in one intelligent community experience.'}
                </p>
                <div className="mt-8 flex items-center gap-4">
                    <Link
                        href={register()}
                        className="rounded-md bg-black px-5 py-2.5 text-sm text-white dark:bg-white dark:text-black"
                    >
                        {hero?.button_text ?? 'Get started'}
                    </Link>
                    <Link
                        href="#features"
                        className="rounded-md border border-black/20 px-5 py-2.5 text-sm hover:border-black/40 dark:border-white/20"
                    >
                        Explore features
                    </Link>
                </div>
            </section>

            <section id="features" className="border-t border-black/10 py-20 dark:border-white/10">
                <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                    <h2 className="text-center text-3xl font-bold">Everything a community needs</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                        From estates and towers to finance and community life — QNEXUS brings it all
                        together on one platform.
                    </p>
                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {moduleList.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="rounded-xl border border-black/10 p-6 dark:border-white/10"
                            >
                                <Icon className="mb-4 size-6" />
                                <h3 className="font-semibold">{title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {sections
                .filter((s) => s.section_type !== 'hero' && s.section_type !== 'features')
                .map((section) => (
                    <section
                        key={section.id}
                        className="border-t border-black/10 py-20 dark:border-white/10"
                    >
                        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                            <h2 className="text-3xl font-bold">{section.heading ?? section.name}</h2>
                            {section.subheading && (
                                <p className="mt-3 text-muted-foreground">{section.subheading}</p>
                            )}
                            {section.body && (
                                <p className="mt-4 max-w-3xl whitespace-pre-line text-muted-foreground">
                                    {section.body}
                                </p>
                            )}
                            {section.button_text && (
                                <Link
                                    href={section.button_link ?? '#'}
                                    className="mt-6 inline-block rounded-md bg-black px-5 py-2.5 text-sm text-white dark:bg-white dark:text-black"
                                >
                                    {section.button_text}
                                </Link>
                            )}
                        </div>
                    </section>
                ))}

            {posts.length > 0 && (
                <section className="border-t border-black/10 py-20 dark:border-white/10">
                    <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
                        <h2 className="text-3xl font-bold">From the blog</h2>
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={postHref(post.slug).url}
                                    className="rounded-xl border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10"
                                >
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="size-3" />
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString()
                                            : 'Unpublished'}
                                    </div>
                                    <h3 className="mt-3 font-semibold">{post.title}</h3>
                                    {post.excerpt && (
                                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="border-t border-black/10 bg-black py-16 text-white dark:border-white/10 dark:bg-white dark:text-black">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center lg:px-8">
                    <h2 className="text-3xl font-bold">Ready to modernize your society?</h2>
                    <Link
                        href={register()}
                        className="rounded-md bg-white px-6 py-3 text-sm text-black dark:bg-black dark:text-white"
                    >
                        Start with QNEXUS
                    </Link>
                </div>
            </section>
        </>
    );
}