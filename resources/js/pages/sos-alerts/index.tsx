import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCan } from '@/lib/permissions';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SosAlert {
    id: number;
    alert_type: string;
    message: string | null;
    latitude: number | null;
    longitude: number | null;
    status: 'active' | 'responded' | 'resolved';
    user?: { id: number; name: string } | null;
}

const statusColors: Record<SosAlert['status'], string> = {
    active: 'text-amber-600',
    responded: 'text-blue-600',
    resolved: 'text-green-600',
};

export default function SosAlertsIndex({ alerts }: { alerts: SosAlert[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();
    const [statuses, setStatuses] = useState<Record<number, string>>(() => {
        const map: Record<number, string> = {};
        alerts.forEach((a) => {
            map[a.id] = a.status;
        });
        return map;
    });

    const handleDelete = (id: number) => {
        if (confirm('Delete this SOS alert?')) {
            deleteForm(`/sos-alerts/${id}`);
        }
    };

    const statusForm = useForm<{ status: SosAlert['status'] }>({
        status: 'active',
    });

    const handleStatusChange = (id: number, value: SosAlert['status']) => {
        setStatuses((prev) => ({ ...prev, [id]: value }));
        statusForm.setData('status', value);
        statusForm.put(`/sos-alerts/${id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="SOS Alerts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-muted-foreground" />
                        <h1 className="text-xl font-semibold">SOS Alerts</h1>
                    </div>
                    {can('Create SOS Alerts') && (
                        <Button asChild size="sm">
                            <Link href="/sos-alerts/create">
                                <Plus /> New Alert
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {alerts.length === 0 && (
                        <p className="text-muted-foreground">No SOS alerts yet.</p>
                    )}
                    {alerts.map((alert) => (
                        <Card key={alert.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        {alert.alert_type}
                                    </CardTitle>
                                    <span className={`text-sm font-medium capitalize ${statusColors[alert.status]}`}>
                                        {statuses[alert.id] ?? alert.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {alert.message && (
                                    <p className="text-muted-foreground text-sm">{alert.message}</p>
                                )}
                                <p className="text-muted-foreground text-sm">
                                    {alert.user?.name ?? `User #${alert.user?.id}`}
                                </p>
                                {(alert.latitude != null || alert.longitude != null) && (
                                    <p className="text-muted-foreground text-xs">
                                        {alert.latitude ?? '-'} , {alert.longitude ?? '-'}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 pt-1">
                                    <Select
                                        value={statuses[alert.id] ?? alert.status}
                                        onValueChange={(v) => handleStatusChange(alert.id, v as SosAlert['status'])}
                                    >
                                        <SelectTrigger className="w-[130px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="responded">Responded</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {can('Delete SOS Alerts') && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(alert.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
