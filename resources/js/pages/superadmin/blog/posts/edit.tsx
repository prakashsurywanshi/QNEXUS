import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index, update } from '@/routes/superadmin/blog/posts';

type PostData = {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover_image: string;
    category: string;
    author: string;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
    status: string;
    published_at: string;
};

type Post = PostData & { id: number };

export default function BlogPostEdit({ post }: { post: Post }) {
    const { data, setData, put, processing, errors } = useForm<PostData>({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        body: post.body ?? '',
        cover_image: post.cover_image ?? '',
        category: post.category ?? '',
        author: post.author ?? '',
        meta_title: post.meta_title ?? '',
        meta_keyword: post.meta_keyword ?? '',
        meta_description: post.meta_description ?? '',
        status: post.status,
        published_at: post.published_at ?? '',
    });

    return (
        <>
            <Head title="Edit Post" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Edit Post" description={post.title} />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(post.id).url);
                    }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            />
                            <InputError message={errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                name="author"
                                value={data.author}
                                onChange={(e) => setData('author', e.target.value)}
                            />
                            <InputError message={errors.author} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            rows={2}
                        />
                        <InputError message={errors.excerpt} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="body">Body</Label>
                        <Textarea
                            id="body"
                            name="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={10}
                            required
                        />
                        <InputError message={errors.body} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cover_image">Cover image URL</Label>
                        <Input
                            id="cover_image"
                            name="cover_image"
                            value={data.cover_image}
                            onChange={(e) => setData('cover_image', e.target.value)}
                        />
                        <InputError message={errors.cover_image} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Published at</Label>
                            <Input
                                id="published_at"
                                name="published_at"
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(e) => setData('published_at', e.target.value)}
                            />
                            <InputError message={errors.published_at} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meta_title">Meta title</Label>
                        <Input
                            id="meta_title"
                            name="meta_title"
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                        />
                        <InputError message={errors.meta_title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meta_keyword">Meta keywords</Label>
                        <Input
                            id="meta_keyword"
                            name="meta_keyword"
                            value={data.meta_keyword}
                            onChange={(e) => setData('meta_keyword', e.target.value)}
                        />
                        <InputError message={errors.meta_keyword} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meta_description">Meta description</Label>
                        <Textarea
                            id="meta_description"
                            name="meta_description"
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                        />
                        <InputError message={errors.meta_description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update post</Button>
                        <Button asChild variant="ghost" type="button">
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

BlogPostEdit.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/super-admin' },
        { title: 'Blog Posts', href: index() },
        { title: 'Edit' },
    ],
};