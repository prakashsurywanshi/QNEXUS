import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { update } from '@/routes/societies';

type SocietyData = {
    name: string;
    email: string;
    phone_number: string;
    timezone: string;
    address: string;
    property_type: string;
    show_logo_text: boolean;
    logo: File | null;
    theme_hex: string;
    theme_rgb: string;
};

interface SocietyProps {
    id: number;
    name: string;
    email: string | null;
    phone_number: string | null;
    timezone: string | null;
    address: string | null;
    property_type: string | null;
    show_logo_text: boolean;
    logo_url?: string | null;
    theme_hex?: string | null;
    theme_rgb?: string | null;
}

export default function EditSociety({ society }: { society: SocietyProps }) {
    const { data, setData, put, processing, errors } = useForm<SocietyData>({
        name: society.name,
        email: society.email ?? '',
        phone_number: society.phone_number ?? '',
        timezone: society.timezone ?? '',
        address: society.address ?? '',
        property_type: society.property_type ?? 'residential',
        show_logo_text: Boolean(society.show_logo_text),
        logo: null,
        theme_hex: society.theme_hex ?? '',
        theme_rgb: society.theme_rgb ?? '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(society.id).url);
    };

    return (
        <>
            <Head title="Edit Society" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit Society" description="Update the society details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone</Label>
                            <Input id="phone_number" name="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} />
                            <InputError message={errors.phone_number} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="property_type">Property type</Label>
                        <Select value={data.property_type} onValueChange={(v) => setData('property_type', v)}>
                            <SelectTrigger id="property_type" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.property_type} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input id="timezone" name="timezone" value={data.timezone} onChange={(e) => setData('timezone', e.target.value)} />
                        <InputError message={errors.timezone} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" name="address" rows={3} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        <InputError message={errors.address} />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input id="show_logo_text" type="checkbox" checked={data.show_logo_text} onChange={(e) => setData('show_logo_text', e.target.checked)} className="size-4" />
                            <Label htmlFor="show_logo_text">Show logo text</Label>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="logo">Logo</Label>
                        <Input
                            id="logo"
                            name="logo"
                            type="file"
                            accept="image/jpeg,image/png,image/svg+xml,image/webp"
                            onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
                        />
                        <InputError message={errors.logo} />
                        {society.logo_url && (
                            <img src={society.logo_url} alt="Society logo" className="mt-2 h-12 w-12 rounded-md object-contain" />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="theme_hex">Brand colour (hex)</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={data.theme_hex || '#6d28d9'}
                                    onChange={(e) => setData('theme_hex', e.target.value)}
                                    className="h-9 w-10 rounded-md border border-input"
                                />
                                <Input
                                    id="theme_hex"
                                    name="theme_hex"
                                    value={data.theme_hex}
                                    placeholder="#6d28d9"
                                    onChange={(e) => setData('theme_hex', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.theme_hex} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="theme_rgb">Brand colour (rgb)</Label>
                            <Input id="theme_rgb" name="theme_rgb" value={data.theme_rgb} placeholder="e.g. 109 40 217" onChange={(e) => setData('theme_rgb', e.target.value)} />
                            <InputError message={errors.theme_rgb} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update society</Button>
                    </div>
                </form>
            </div>
        </>
    );
}