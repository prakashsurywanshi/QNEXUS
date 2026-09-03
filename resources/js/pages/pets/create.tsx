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

type User = { id: number; name: string };
type Apartment = { id: number; apartment_number: string };

type PetData = {
    user_id: string;
    apartment_id: string;
    name: string;
    species: string;
    breed: string;
    color: string;
    weight: string;
    vaccination_status: 'up_to_date' | 'overdue' | 'unknown';
    last_vaccination_date: string;
    next_vaccination_date: string;
    is_neutered: boolean;
    microchip_id: string;
    notes: string;
};

export default function CreatePet({ users, apartments }: { users: User[]; apartments: Apartment[] }) {
    const { data, setData, post, processing, errors } = useForm<PetData>({
        user_id: '',
        apartment_id: '',
        name: '',
        species: '',
        breed: '',
        color: '',
        weight: '',
        vaccination_status: 'unknown',
        last_vaccination_date: '',
        next_vaccination_date: '',
        is_neutered: false,
        microchip_id: '',
        notes: '',
    });

    return (
        <>
            <Head title="Register Pet" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Register Pet"
                    description="Register a new pet"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/pets');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label>Owner *</Label>
                        <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Apartment</Label>
                        <Select value={data.apartment_id} onValueChange={(v) => setData('apartment_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select apartment (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {apartments.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {a.apartment_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.apartment_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. Buddy"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="species">Species *</Label>
                            <Input
                                id="species"
                                value={data.species}
                                onChange={(e) => setData('species', e.target.value)}
                                required
                                placeholder="e.g. Dog"
                            />
                            <InputError message={errors.species} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="breed">Breed</Label>
                            <Input
                                id="breed"
                                value={data.breed}
                                onChange={(e) => setData('breed', e.target.value)}
                                placeholder="e.g. Labrador"
                            />
                            <InputError message={errors.breed} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                                id="color"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                placeholder="e.g. Golden"
                            />
                            <InputError message={errors.color} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                value={data.weight}
                                onChange={(e) => setData('weight', e.target.value)}
                            />
                            <InputError message={errors.weight} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="microchip_id">Microchip ID</Label>
                            <Input
                                id="microchip_id"
                                value={data.microchip_id}
                                onChange={(e) => setData('microchip_id', e.target.value)}
                            />
                            <InputError message={errors.microchip_id} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.vaccination_status} onValueChange={(v) => setData('vaccination_status', v as PetData['vaccination_status'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select vaccination status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="up_to_date">Up to Date</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.vaccination_status} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="last_vaccination_date">Last Vaccination Date</Label>
                            <Input
                                id="last_vaccination_date"
                                type="date"
                                value={data.last_vaccination_date}
                                onChange={(e) => setData('last_vaccination_date', e.target.value)}
                            />
                            <InputError message={errors.last_vaccination_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="next_vaccination_date">Next Vaccination Date</Label>
                            <Input
                                id="next_vaccination_date"
                                type="date"
                                value={data.next_vaccination_date}
                                onChange={(e) => setData('next_vaccination_date', e.target.value)}
                            />
                            <InputError message={errors.next_vaccination_date} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_neutered"
                            type="checkbox"
                            checked={data.is_neutered}
                            onChange={(e) => setData('is_neutered', e.target.checked)}
                            className="size-4 rounded border-gray-300"
                        />
                        <Label htmlFor="is_neutered">Neutered / Spayed</Label>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes"
                            rows={3}
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Register Pet</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreatePet.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Pets', href: '/pets' },
        { title: 'New', href: '/pets/create' },
    ],
};
