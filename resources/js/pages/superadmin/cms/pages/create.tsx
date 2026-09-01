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
import { edit as editSetting } from '@/routes/superadmin/settings';
import { create, index, store } from '@/routes/superadmin/cms/pages';

type PageData = {
    title: string;
    slug: string;
    content: string;
    image: string;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
    status: string;
    sort_order: string;
};

export default function CmsPageCreate() {
    const { data, setData, post, processing, errors } = useForm<PageData>({
        title: '',
        slug: '',
        content: '',
        image: '',
        meta_title: '',
        meta_keyword: '',
        meta_description: '',
        status: 'draft',
        sort_order: '0',
    });

    return (
        <>
            <Head title="Create Page" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Create Page" description="Add a new public CMS page" />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(store().url);
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
                            placeholder="e.g. About Us"
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
                            placeholder="leave blank to auto-generate"
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            name="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={10}
                            placeholder="Page body content"
                        />
                        <InputError message={errors.content} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            name="image"
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                        />
                        <InputError message={errors.image} />
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
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                            />
                            <InputError message={errors.sort_order} />
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
                        <Button disabled={processing}>Create page</Button>
                        <Button asChild variant="ghost" type="button">
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CmsPageCreate.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/super-admin' },
        { title: 'CMS Pages', href: index() },
        { title: 'Create' },
    ],
};