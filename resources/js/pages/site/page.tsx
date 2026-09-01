import { Head } from '@inertiajs/react';

type Page = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    meta_title: string | null;
    meta_keyword: string | null;
    meta_description: string | null;
};

export default function SitePage({ page }: { page: Page }) {
    return (
        <>
            <Head title={page.meta_title ?? page.title}>
                {page.meta_description && (
                    <meta name="description" content={page.meta_description} />
                )}
                {page.meta_keyword && <meta name="keywords" content={page.meta_keyword} />}
            </Head>
            <article className="mx-auto w-full max-w-3xl px-4 py-16 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
                {page.content && (
                    <div className="mt-8 space-y-4 whitespace-pre-line">{page.content}</div>
                )}
            </article>
        </>
    );
}