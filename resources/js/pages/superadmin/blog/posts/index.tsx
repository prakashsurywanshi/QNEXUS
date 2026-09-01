import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/superadmin';
import { create, destroy, edit, index as postsIndex } from '@/routes/superadmin/blog/posts';

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    status: string;
    published_at: string | null;
};

export default function BlogPostsIndex({ posts }: { posts: BlogPost[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this post?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Blog Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Blog Posts</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Post
                        </Link>
                    </Button>
                </div>

                {posts.length === 0 ? (
                    <p className="text-muted-foreground">No posts created yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-medium">Title</th>
                                    <th className="pb-2 font-medium">Category</th>
                                    <th className="pb-2 font-medium">Status</th>
                                    <th className="pb-2 font-medium">Published</th>
                                    <th className="pb-2 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id} className="border-b">
                                        <td className="py-2 font-medium">{post.title}</td>
                                        <td className="py-2 text-muted-foreground">
                                            {post.category ?? '—'}
                                        </td>
                                        <td className="py-2">
                                            <span
                                                className={
                                                    post.status === 'published'
                                                        ? 'text-green-600'
                                                        : 'text-muted-foreground'
                                                }
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="py-2 text-muted-foreground">
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="py-2">
                                            <div className="flex items-center gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={edit(post.id).url}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash2 /> Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

BlogPostsIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Blog Posts', href: postsIndex() },
    ],
};