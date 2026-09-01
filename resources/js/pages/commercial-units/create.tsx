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
import { create } from '@/routes/commercial-units';

type UnitData = {
    building_id: string;
    commercial_tenant_id: string;
    unit_number: string;
    floor: string;
    area_sqft: string;
    unit_type: string;
    status: string;
    monthly_rent: string;
    notes: string;
};

interface Option {
    id: number;
    name?: string | null;
    company_name?: string | null;
    unit_number?: string | null;
}

export default function CreateCommercialUnit({
    buildings,
    commercialTenants,
}: {
    buildings: Option[];
    commercialTenants: Option[];
}) {
    const { data, setData, post, processing, errors } = useForm<UnitData>({
        building_id: '',
        commercial_tenant_id: '',
        unit_number: '',
        floor: '',
        area_sqft: '0',
        unit_type: 'office',
        status: 'vacant',
        monthly_rent: '0',
        notes: '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Commercial Unit" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Commercial Unit" description="Create a new commercial unit" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="building_id">Building</Label>
                            <Select value={data.building_id} onValueChange={(v) => setData('building_id', v)}>
                                <SelectTrigger id="building_id" className="w-full"><SelectValue placeholder="Select building" /></SelectTrigger>
                                <SelectContent>
                                    {buildings.map((b) => (
                                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.building_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="commercial_tenant_id">Tenant</Label>
                            <Select value={data.commercial_tenant_id} onValueChange={(v) => setData('commercial_tenant_id', v)}>
                                <SelectTrigger id="commercial_tenant_id" className="w-full"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                                <SelectContent>
                                    {commercialTenants.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            {t.company_name ?? t.unit_number ?? `#${t.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.commercial_tenant_id} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unit_number">Unit number</Label>
                            <Input id="unit_number" name="unit_number" value={data.unit_number} onChange={(e) => setData('unit_number', e.target.value)} required />
                            <InputError message={errors.unit_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="floor">Floor</Label>
                            <Input id="floor" name="floor" value={data.floor} onChange={(e) => setData('floor', e.target.value)} />
                            <InputError message={errors.floor} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="area_sqft">Area (sqft)</Label>
                            <Input id="area_sqft" name="area_sqft" type="number" step="0.01" min={0} value={data.area_sqft} onChange={(e) => setData('area_sqft', e.target.value)} />
                            <InputError message={errors.area_sqft} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="monthly_rent">Monthly rent</Label>
                            <Input id="monthly_rent" name="monthly_rent" type="number" step="0.01" min={0} value={data.monthly_rent} onChange={(e) => setData('monthly_rent', e.target.value)} />
                            <InputError message={errors.monthly_rent} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unit_type">Unit type</Label>
                            <Select value={data.unit_type} onValueChange={(v) => setData('unit_type', v)}>
                                <SelectTrigger id="unit_type" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="office">Office</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="warehouse">Warehouse</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.unit_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vacant">Vacant</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="under_maintenance">Under maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        <InputError message={errors.notes} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save unit</Button>
                    </div>
                </form>
            </div>
        </>
    );
}