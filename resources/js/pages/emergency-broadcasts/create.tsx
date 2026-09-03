import { useForm } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Options {
    categories: string[];
    audiences: string[];
    severities: string[];
}

type BroadcastData = {
    title: string;
    category: string;
    message: string;
    audience: string;
    severity: string;
    location: string;
};

export default function CreateBroadcast({
    categories,
    audiences,
    severities,
}: Options) {
    const { data, setData, post, processing, errors } = useForm<BroadcastData>({
        title: '',
        category: 'security',
        message: '',
        audience: 'all',
        severity: 'warning',
        location: '',
    });

    return (
        <>
            <Head title="New Broadcast" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Emergency Broadcast"
                    description="Send an urgent alert to the selected audience"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Broadcast Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                post('/emergency-broadcasts');
                            }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Fire drill in Tower B"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Category *</Label>
                                    <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c.replace('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Audience *</Label>
                                    <Select value={data.audience} onValueChange={(v) => setData('audience', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {audiences.map((a) => (
                                                <SelectItem key={a} value={a}>
                                                    {a.charAt(0).toUpperCase() + a.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.audience} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Severity *</Label>
                                    <Select value={data.severity} onValueChange={(v) => setData('severity', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {severities.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.severity} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Tower B, 3rd floor"
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={5}
                                        placeholder="Describe the situation, instructions and any evacuation guidance"
                                        required
                                    />
                                    <InputError message={errors.message} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Send Broadcast
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/emergency-broadcasts">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateBroadcast.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Emergency Broadcasts', href: '/emergency-broadcasts' },
        { title: 'New', href: '/emergency-broadcasts/create' },
    ],
};
