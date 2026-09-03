import { Head, Link, router } from '@inertiajs/react';
import { CalendarClock, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { index as serviceRequestsIndex } from '@/routes/service-requests';

interface ServiceRequestItem {
    id: number;
    subject: string;
    service_type: string;
    priority: string;
    status: string;
    quote_amount: string | null;
    user: { name: string } | null;
    assignee: { name: string } | null;
}

interface Pagination {
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    from: number | null;
    to: number | null;
}

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

const statusBadge: Record<string, string> = {
    request: 'default',
    quoted: 'outline',
    approved: 'outline',
    assigned: 'default',
    in_progress: 'outline',
    payment_pending: 'destructive',
    feedback: 'outline',
    completed: 'default',
    cancelled: 'destructive',
} as const;

export default function ServiceRequestsIndex({ serviceRequests, statusCounts, statuses }: { serviceRequests: { data: ServiceRequestItem[]; links: Pagination }; statusCounts: Record<string, number>; statuses: string[] }) {
    const [filter, setFilter] = useState('');

    const pagination = serviceRequests.links;

    const handleDelete = (id: number) => {
        if (confirm('Delete this service request?')) {
            router.delete(`/service-requests/${id}`);
        }
    };

    const applyFilter = (status: string) => {
        if (!status) {
            router.get('/service-requests');
            return;
        }
        router.get('/service-requests', { status });
    };

    return (
        <>
            <Head title="Service Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Service Requests" description="Resident service requests with quote, approval, assignment and feedback workflow." />
                    <Link href="/service-requests/create">
                        <Button>
                            <Plus className="mr-2 size-4" />
                            New Request
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select value={filter} onValueChange={applyFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All statuses</SelectItem>
                            {statuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {statusLabels[s] ?? s} ({statusCounts[s] ?? 0})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="p-3 font-medium">Subject</th>
                                <th className="p-3 font-medium">Type</th>
                                <th className="p-3 font-medium">Priority</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Requested By</th>
                                <th className="p-3 font-medium">Assignee</th>
                                <th className="p-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceRequests.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-muted-foreground">No service requests found.</td>
                                </tr>
                            )}
                            {serviceRequests.data.map((r) => (
                                <tr key={r.id} className="border-b last:border-0">
                                    <td className="p-3">
                                        <Link href={`/service-requests/${r.id}`} className="font-medium hover:underline">{r.subject}</Link>
                                    </td>
                                    <td className="p-3">{r.service_type}</td>
                                    <td className="p-3 capitalize">{r.priority}</td>
                                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs text-white ${r.status === 'completed' ? 'bg-green-600' : r.status === 'cancelled' || r.status === 'payment_pending' ? 'bg-red-600' : 'bg-slate-600'}`}>{statusLabels[r.status] ?? r.status}</span></td>
                                    <td className="p-3">{r.user?.name ?? '—'}</td>
                                    <td className="p-3">{r.assignee?.name ?? '—'}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Showing {pagination.from ?? 0}–{pagination.to ?? 0} of {pagination.total}</p>
                        <div className="flex items-center gap-2">
                            {pagination.prev_page_url ? (
                                <Button variant="outline" size="sm" onClick={() => router.get(pagination.prev_page_url!)}>
                                    <ChevronLeft className="size-4" />
                                </Button>
                            ) : <Button variant="outline" size="sm" disabled><ChevronLeft className="size-4" /></Button>}
                            <span className="text-sm text-muted-foreground">Page {pagination.current_page} of {pagination.last_page}</span>
                            {pagination.next_page_url ? (
                                <Button variant="outline" size="sm" onClick={() => router.get(pagination.next_page_url!)}>
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : <Button variant="outline" size="sm" disabled><ChevronRight className="size-4" /></Button>}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

ServiceRequestsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Service Requests', href: serviceRequestsIndex() },
    ],
};
