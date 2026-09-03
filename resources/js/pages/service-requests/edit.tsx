import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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

const statusLabels: Record<string, string> = {
    request: 'Requested',
    quoted: 'Quoted',
    approved: 'Approved',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    payment_pending: 'Payment Pending',
    feedback: 'Feedback',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const priorityLabels: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };

export default function ServiceRequestsEdit({ serviceRequest, serviceTypes, priorities }: { serviceRequest: any; serviceTypes: string[]; priorities: string[] }) {
    const { data, setData, put, processing, errors } = useForm({
        subject: serviceRequest.subject,
        description: serviceRequest.description ?? '',
        service_type: serviceRequest.service_type,
        priority: serviceRequest.priority,
        status: serviceRequest.status,
        quote_amount: serviceRequest.quote_amount ?? '',
        quote_notes: serviceRequest.quote_notes ?? '',
        quote_valid_until: serviceRequest.quote_valid_until ?? '',
        scheduled_date: serviceRequest.scheduled_date ?? '',
        completion_notes: serviceRequest.completion_notes ?? '',
    });

    return (
        <>
            <Head title="Edit Service Request" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                    <Link href={`/service-requests/${serviceRequest.id}`}><Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button></Link>
                    <Heading title="Edit Service Request" description={serviceRequest.subject} />
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); put(`/service-requests/${serviceRequest.id}`); }}
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Service Type</Label>
                            <Select value={data.service_type} onValueChange={(v) => setData('service_type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{serviceTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Priority</Label>
                            <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{priorities.map((p) => <SelectItem key={p} value={p}>{priorityLabels[p] ?? p}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} required />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{['request', 'quoted', 'approved', 'assigned', 'in_progress', 'payment_pending', 'feedback', 'completed', 'cancelled'].map((s) => <SelectItem key={s} value={s}>{statusLabels[s] ?? s}</SelectItem>)}</SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label>Quote Amount (₹)</Label><Input type="number" min="0" value={data.quote_amount} onChange={(e) => setData('quote_amount', e.target.value)} /></div>
                        <div className="grid gap-2"><Label>Quote Valid Until</Label><Input type="date" value={data.quote_valid_until} onChange={(e) => setData('quote_valid_until', e.target.value)} /></div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Quote Notes</Label>
                        <Textarea value={data.quote_notes} onChange={(e) => setData('quote_notes', e.target.value)} rows={2} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Scheduled Date</Label>
                        <Input type="date" value={data.scheduled_date} onChange={(e) => setData('scheduled_date', e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Completion Notes</Label>
                        <Textarea value={data.completion_notes} onChange={(e) => setData('completion_notes', e.target.value)} rows={2} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 size-4" />
                        Save Changes
                    </Button>
                </form>
            </div>
        </>
    );
}
