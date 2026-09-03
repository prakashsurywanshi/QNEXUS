import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

const categoryLabels: Record<string, string> = {
    police: 'Police',
    fire: 'Fire',
    ambulance: 'Ambulance',
    hospital: 'Hospital',
    gas_leak: 'Gas Leak',
    electrician: 'Electrician',
    plumber: 'Plumber',
    other: 'Other',
};

interface Contact {
    id: number;
    name: string;
    phone: string;
    category: string;
    is_active: boolean;
}

export default function EditEmergencyContact({ contact, categories }: { contact: Contact; categories: string[] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: contact.name,
        phone: contact.phone,
        category: contact.category,
        is_active: contact.is_active,
    });

    return (
        <>
            <Head title={`Edit ${contact.name}`} />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title={`Edit ${contact.name}`} description="Update emergency contact details" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/emergency-contacts/${contact.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {categoryLabels[c] ?? c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch checked={data.is_active} onCheckedChange={(v) => setData('is_active', v)} />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditEmergencyContact.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Emergency Contacts', href: '/emergency-contacts' },
        { title: 'Edit', href: '#' },
    ],
};
