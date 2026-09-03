import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
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

const priorityLabels: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };

export default function ServiceRequestsCreate({ serviceTypes, priorities }: { serviceTypes: string[]; priorities: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        service_type: serviceTypes[0] ?? '',
        priority: 'medium',
    });

    return (
        <>
            <Head title="New Service Request" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                    <Link href="/service-requests"><Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button></Link>
                    <Heading title="New Service Request" description="Request a service for your apartment or society." />
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); post('/service-requests'); }}
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="service_type">Service Type</Label>
                        <Select value={data.service_type} onValueChange={(v) => setData('service_type', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {serviceTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.service_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} required placeholder="e.g. Leaking kitchen tap" />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Priority</Label>
                        <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {priorities.map((p) => <SelectItem key={p} value={p}>{priorityLabels[p] ?? p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.priority} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} placeholder="Describe the issue or service needed" />
                        <InputError message={errors.description} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Plus className="mr-2 size-4" />
                        Submit Request
                    </Button>
                </form>
            </div>
        </>
    );
}
