import { Head, Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { blog } from '@/routes/site';

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    cover_image: string | null;
    category: string | null;
    author: string | null;
    published_at: string | null;
};

export default function BlogPost({ post }: { post: Post }) {
    return (
        <>
            <Head title={post.title}>
                {post.excerpt && <meta name="description" content={post.excerpt} />}
            </Head>
            <article className="mx-auto w-full max-w-3xl px-4 py-16 lg:px-8">
                <Link
                    href={blog().url}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to blog
                </Link>
                <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>
                        {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : 'Unpublished'}
                    </span>
                    {post.category && <span>· {post.category}</span>}
                    {post.author && <span>· {post.author}</span>}
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">{post.title}</h1>
                {post.excerpt && (
                    <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                )}
                <div className="mt-8 space-y-4 whitespace-pre-line">{post.body}</div>
            </article>
        </>
    );
}