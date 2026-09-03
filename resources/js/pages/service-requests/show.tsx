import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Forward, Reply, Send, Hammer } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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

const nextAction: Record<string, string> = {
    request: 'Approve Request',
    quoted: 'Approve Quote',
    approved: 'Assign to Staff',
    assigned: 'Start Service',
    in_progress: 'Mark Payment Pending',
    payment_pending: 'Request Feedback',
    feedback: 'Mark Completed',
};

export default function ServiceRequestsShow({ serviceRequest, current_user_id, serviceProviders, agents, statuses }: {
    serviceRequest: any;
    current_user_id: number;
    serviceProviders: { id: number; company_name: string }[];
    agents: any[];
    statuses: string[];
}) {
    const quote = useForm({ quote_amount: '', quote_notes: '', quote_valid_until: '' });
    const assign = useForm({ assigned_to: '', service_provider_id: '', scheduled_date: '' });
    const reply = useForm({ message: '' });
    const feedback = useForm({ rating: '', feedback: '', payment_status: 'paid', payment_amount: '' });

    const submitQuote = () => {
        quote.post(`/service-requests/${serviceRequest.id}/quote`, { preserveScroll: true });
    };

    const submitAssign = () => {
        assign.post(`/service-requests/${serviceRequest.id}/assign`, { preserveScroll: true });
    };

    const advance = () => {
        router.post(`/service-requests/${serviceRequest.id}/advance`, {}, { preserveScroll: true });
    };

    const submitReply = () => {
        reply.post(`/service-requests/${serviceRequest.id}/reply`, { preserveScroll: true });
    };

    const submitFeedback = () => {
        feedback.put(`/service-requests/${serviceRequest.id}`, { preserveScroll: true });
    };

    const canAdvance = ['request', 'quoted', 'approved', 'assigned', 'in_progress', 'payment_pending', 'feedback'].includes(serviceRequest.status);
    const isOwner = serviceRequest.user_id === current_user_id;

    return (
        <>
            <Head title={serviceRequest.subject} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                    <Link href="/service-requests"><Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button></Link>
                    <Heading title={serviceRequest.subject} description={`${serviceRequest.service_type} · ${statusLabels[serviceRequest.status] ?? serviceRequest.status}`} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-xl border p-4">
                            <h2 className="mb-3 font-medium">Request Details</h2>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{serviceRequest.description || 'No description provided.'}</p>
                            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                <div><dt className="text-muted-foreground">Priority</dt><dd className="capitalize">{serviceRequest.priority}</dd></div>
                                <div><dt className="text-muted-foreground">Requested by</dt><dd>{serviceRequest.user?.name ?? '—'}</dd></div>
                                <div><dt className="text-muted-foreground">Assignee</dt><dd>{serviceRequest.assignee?.name ?? '—'}</dd></div>
                                <div><dt className="text-muted-foreground">Provider</dt><dd>{serviceRequest.service_provider?.company_name ?? '—'}</dd></div>
                                {serviceRequest.scheduled_date && <div><dt className="text-muted-foreground">Scheduled</dt><dd>{serviceRequest.scheduled_date}</dd></div>}
                                {serviceRequest.quote_amount != null && <div><dt className="text-muted-foreground">Quote</dt><dd>₹{serviceRequest.quote_amount}</dd></div>}
                                {serviceRequest.rating != null && <div><dt className="text-muted-foreground">Rating</dt><dd>{'★'.repeat(serviceRequest.rating)}</dd></div>}
                            </dl>
                        </div>

                        <div className="rounded-xl border p-4">
                            <h2 className="mb-3 font-medium">Conversation</h2>
                            <div className="space-y-3">
                                {serviceRequest.replies.length === 0 && <p className="text-sm text-muted-foreground">No replies yet.</p>}
                                {serviceRequest.replies.map((r: any) => (
                                    <div key={r.id} className="rounded-lg bg-muted p-3 text-sm">
                                        <p className="font-medium">{r.user?.name}</p>
                                        <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); submitReply(); }} className="mt-4 flex gap-2">
                                <Textarea className="flex-1" value={reply.data.message} onChange={(e) => reply.setData('message', e.target.value)} rows={2} placeholder="Write a reply..." required />
                                <Button type="submit" disabled={reply.processing}><Reply className="mr-2 size-4" />Reply</Button>
                            </form>
                            <InputError message={reply.errors.message} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {canAdvance && (
                            <div className="rounded-xl border p-4">
                                <Button className="w-full" onClick={advance}>
                                    <Forward className="mr-2 size-4" />
                                    {nextAction[serviceRequest.status] ?? 'Advance'}
                                </Button>
                            </div>
                        )}

                        {['request', 'quoted'].includes(serviceRequest.status) && !isOwner && (
                            <div className="rounded-xl border p-4">
                                <h3 className="mb-3 font-medium"><Hammer className="mr-1 inline size-4" />Provide Quote</h3>
                                <form onSubmit={(e) => { e.preventDefault(); submitQuote(); }} className="space-y-3">
                                    <div className="grid gap-2"><Label>Amount (₹)</Label><Input type="number" min="0" value={quote.data.quote_amount} onChange={(e) => quote.setData('quote_amount', e.target.value)} required /></div>
                                    <div className="grid gap-2"><Label>Notes</Label><Textarea value={quote.data.quote_notes} onChange={(e) => quote.setData('quote_notes', e.target.value)} rows={2} /></div>
                                    <div className="grid gap-2"><Label>Valid Until</Label><Input type="date" value={quote.data.quote_valid_until} onChange={(e) => quote.setData('quote_valid_until', e.target.value)} /></div>
                                    <Button type="submit" className="w-full" disabled={quote.processing}><Check className="mr-2 size-4" />Submit Quote</Button>
                                </form>
                                <InputError message={quote.errors.quote_amount} />
                            </div>
                        )}

                        {['approved', 'quoted'].includes(serviceRequest.status) && !isOwner && (
                            <div className="rounded-xl border p-4">
                                <h3 className="mb-3 font-medium">Assign</h3>
                                <form onSubmit={(e) => { e.preventDefault(); submitAssign(); }} className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Assign to Staff</Label>
                                        <Select value={assign.data.assigned_to} onValueChange={(v) => assign.setData('assigned_to', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                                            <SelectContent>
                                                {agents.map((a: any) => <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Service Provider</Label>
                                        <Select value={assign.data.service_provider_id} onValueChange={(v) => assign.setData('service_provider_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                                            <SelectContent>
                                                {serviceProviders.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.company_name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2"><Label>Scheduled Date</Label><Input type="date" value={assign.data.scheduled_date} onChange={(e) => assign.setData('scheduled_date', e.target.value)} /></div>
                                    <Button type="submit" className="w-full" disabled={assign.processing}>Assign</Button>
                                </form>
                            </div>
                        )}

                        {isOwner && serviceRequest.payment_amount == null && (
                            <div className="rounded-xl border p-4">
                                <h3 className="mb-3 font-medium">Payment & Feedback</h3>
                                <div className="grid gap-3">
                                    <div className="grid gap-2"><Label>Payment Amount (₹)</Label><Input type="number" min="0" value={feedback.data.payment_amount} onChange={(e) => feedback.setData('payment_amount', e.target.value)} /></div>
                                    <div className="grid gap-2"><Label>Rating</Label><Select value={feedback.data.rating} onValueChange={(v) => feedback.setData('rating', v)}><SelectTrigger><SelectValue placeholder="1–5" /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{'★'.repeat(n)}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="grid gap-2"><Label>Feedback</Label><Textarea value={feedback.data.feedback} onChange={(e) => feedback.setData('feedback', e.target.value)} rows={2} /></div>
                                    <Button className="w-full" onClick={submitFeedback}><Send className="mr-2 size-4" />Save</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
