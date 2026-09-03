import { Link, useForm } from '@inertiajs/react';
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
import { create as createSociety, index as societiesIndex, update } from '@/routes/superadmin/societies';

interface SocietyProps {
    id: number;
    name: string;
    email: string | null;
    phone_number: string | null;
    timezone: string | null;
    address: string | null;
    property_type: string | null;
    show_logo_text: boolean;
}

type SocietyData = {
    name: string;
    email: string;
    phone_number: string;
    timezone: string;
    address: string;
    property_type: string;
    show_logo_text: boolean;
};

export default function SuperAdminSocietyEdit({ society }: { society: SocietyProps }) {
    const { data, setData, put, processing, errors } = useForm<SocietyData>({
        name: society.name,
        email: society.email ?? '',
        phone_number: society.phone_number ?? '',
        timezone: society.timezone ?? '',
        address: society.address ?? '',
        property_type: society.property_type ?? 'residential',
        show_logo_text: Boolean(society.show_logo_text),
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(society.id).url);
    };

    return (
        <>
            <Head title="Edit Society" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Edit Society" description="Update the society profile details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <Button disabled={processing}>Update society</Button>
                        <Button variant="outline" asChild>
                            <Link href={societiesIndex().url}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SuperAdminSocietyEdit.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/super-admin' },
        { title: 'Societies', href: createSociety() },
        { title: 'Edit' },
    ],
};