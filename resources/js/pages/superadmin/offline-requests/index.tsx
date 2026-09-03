import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes/superadmin';
import { index as requestsIndex, verify, reject } from '@/routes/superadmin/offline-requests';

type OfflineRequest = {
    id: number;
    society_id: number | null;
    package_type: string;
    amount: number | null;
    description: string | null;
    status: string;
    pay_date: string | null;
    society: { id: number; name: string } | null;
    package: { id: number; package_name: string } | null;
};

const statusStyles: Record<string, string> = {
    pending: 'text-amber-600',
    verified: 'text-green-600',
    rejected: 'text-destructive',
};

export default function OfflineRequestsIndex({ requests }: { requests: OfflineRequest[] }) {
    return (
        <>
            <Head title="Offline Requests" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Offline Requests"
                    description="Approve or reject society plan-change requests submitted through offline payment methods."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Requests</CardTitle>
                        <CardDescription>{requests.length} offline plan-change requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No offline requests yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {request.society?.name ?? `Society #${request.society_id}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {request.package?.package_name ?? request.package_type} ·{' '}
                                                {request.amount != null ? `$${request.amount}` : '—'}
                                            </p>
                                            {request.description && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {request.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1 text-sm ${
                                                    statusStyles[request.status] ?? 'text-muted-foreground'
                                                }`}
                                            >
                                                {request.status === 'verified' ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : request.status === 'rejected' ? (
                                                    <XCircle className="h-4 w-4" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4" />
                                                )}
                                                {request.status}
                                            </span>
                                            {request.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                            router.post(verify(request.id).url)
                                                        }
                                                    >
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            router.post(reject(request.id).url)
                                                        }
                                                    >
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OfflineRequestsIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Offline Requests', href: requestsIndex() },
    ],
};