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
import { index, update } from '@/routes/superadmin/cms/sections';

type SectionData = {
    name: string;
    slug: string;
    section_type: string;
    heading: string;
    subheading: string;
    body: string;
    image: string;
    button_text: string;
    button_link: string;
    status: string;
    sort_order: string;
};

type Section = SectionData & { id: number };

export default function CmsSectionEdit({
    section,
    sectionTypes,
}: {
    section: Section;
    sectionTypes: string[];
}) {
    const { data, setData, put, processing, errors } = useForm<SectionData>({
        name: section.name,
        slug: section.slug,
        section_type: section.section_type,
        heading: section.heading ?? '',
        subheading: section.subheading ?? '',
        body: section.body ?? '',
        image: section.image ?? '',
        button_text: section.button_text ?? '',
        button_link: section.button_link ?? '',
        status: section.status,
        sort_order: section.sort_order.toString(),
    });

    return (
        <>
            <Head title="Edit Section" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Edit Section" description={section.name} />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(section.id).url);
                    }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="section_type">Section type</Label>
                            <Select
                                value={data.section_type}
                                onValueChange={(v) => setData('section_type', v)}
                            >
                                <SelectTrigger id="section_type" className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sectionTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.section_type} />
                        </div>
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

                    <div className="grid gap-2">
                        <Label htmlFor="heading">Heading</Label>
                        <Input
                            id="heading"
                            name="heading"
                            value={data.heading}
                            onChange={(e) => setData('heading', e.target.value)}
                        />
                        <InputError message={errors.heading} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subheading">Subheading</Label>
                        <Input
                            id="subheading"
                            name="subheading"
                            value={data.subheading}
                            onChange={(e) => setData('subheading', e.target.value)}
                        />
                        <InputError message={errors.subheading} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="body">Body</Label>
                        <Textarea
                            id="body"
                            name="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={5}
                        />
                        <InputError message={errors.body} />
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
                            <Label htmlFor="button_text">Button text</Label>
                            <Input
                                id="button_text"
                                name="button_text"
                                value={data.button_text}
                                onChange={(e) => setData('button_text', e.target.value)}
                            />
                            <InputError message={errors.button_text} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="button_link">Button link</Label>
                            <Input
                                id="button_link"
                                name="button_link"
                                value={data.button_link}
                                onChange={(e) => setData('button_link', e.target.value)}
                            />
                            <InputError message={errors.button_link} />
                        </div>
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

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update section</Button>
                        <Button asChild variant="ghost" type="button">
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CmsSectionEdit.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/super-admin' },
        { title: 'Landing Sections', href: index() },
        { title: 'Edit' },
    ],
};