import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TicketType {
    id: number;
    type_name: string;
}

export default function CreateTicket({ types }: { types: TicketType[] }) {
    const { data, setData, post, processing, errors } = useForm<{
        subject: string;
        type_id: string;
    }>({
        subject: '',
        type_id: '',
    });

    return (
        <>
            <Head title="New Ticket" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="New Ticket" description="Raise a ticket for this society" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/tickets');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            required
                            placeholder="What's the issue?"
                        />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type_id">Type</Label>
                        <Select
                            value={data.type_id}
                            onValueChange={(v) => setData('type_id', v)}
                        >
                            <SelectTrigger id="type_id" className="w-full">
                                <SelectValue placeholder="Select a type (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type.id} value={String(type.id)}>
                                        {type.type_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type_id} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create ticket</Button>
                    </div>
                </form>
            </div>
        </>
    );
}