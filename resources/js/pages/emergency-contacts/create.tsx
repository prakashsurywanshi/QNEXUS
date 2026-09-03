import { Head, useForm } from '@inertiajs/react';
import { Siren } from 'lucide-react';
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

export default function CreateEmergencyContact({ categories }: { categories: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        category: 'police',
        is_active: true,
    });

    return (
        <>
            <Head title="New Emergency Contact" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="New Emergency Contact" description="Add an emergency or service contact" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/emergency-contacts');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. City Police Station"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                placeholder="e.g. 100"
                            />
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
                            Add Contact
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

CreateEmergencyContact.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Emergency Contacts', href: '/emergency-contacts' },
        { title: 'New', href: '/emergency-contacts/create' },
    ],
};
