import { Head, Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { post as postHref } from '@/routes/site';

type Post =
    | { id: number; title: string; slug: string; excerpt: string | null; category: string | null; cover_image: string | null; published_at: string | null; body?: string }
    | Record<string, never>;

export default function BlogIndex({ posts }: { posts: Post[] }) {
    return (
        <>
            <Head title="Blog" />
            <div className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
                <p className="mt-3 text-muted-foreground">
                    Insights and news from the QNEXUS community.
                </p>

                {posts.length === 0 ? (
                    <p className="mt-10 text-muted-foreground">No posts published yet.</p>
                ) : (
                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                    {post.category && <span>· {post.category}</span>}
                                </div>
                                <h2 className="mt-3 text-lg font-semibold">{post.title}</h2>
                                {post.excerpt && (
                                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                        {post.excerpt}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}