import { Head, Link, router } from '@inertiajs/react';
import { Cpu, Plus, ServerCog, Wifi, WifiOff } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface SmartDevice {
    id: number;
    device_name: string;
    device_type: string;
    location: string | null;
    vendor: string | null;
    model: string | null;
    serial_number: string | null;
    status: string;
    connected: boolean;
    last_seen_at: string | null;
}

const typeLabels: Record<string, string> = {
    cctv: 'CCTV',
    access_control: 'Access Control',
    rfid: 'RFID',
    anpr: 'ANPR',
    boom_barrier: 'Boom Barrier',
    smart_meter: 'Smart Meter',
    elevator: 'Elevator',
    fire_system: 'Fire System',
    hvac: 'HVAC',
    ev_charger: 'EV Charger',
    iot_sensor: 'IoT Sensor',
};

const statusTone: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    online: 'default',
    maintenance: 'secondary',
    offline: 'destructive',
    disabled: 'outline',
};

export default function SmartBuildingIndex({
    devices,
    deviceTypes,
    statuses,
    summary,
    totals,
}: {
    devices: SmartDevice[];
    deviceTypes: string[];
    statuses: string[];
    summary: Record<string, number>;
    totals: { total: number; online: number; offline: number; maintenance: number; connected: number; disconnected: number };
}) {
    const can = useCan();

    const handleDelete = (id: number) => {
        if (can('Delete Smart Device') && confirm('Delete this device?')) {
            router.delete(`/smart-devices/${id}`);
        }
    };

    const columns: ColumnDef<SmartDevice>[] = [
        {
            accessorKey: 'device_name',
            header: 'Device',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.device_name}</p>
                    {row.original.serial_number && (
                        <p className="text-xs text-muted-foreground">{row.original.serial_number}</p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'device_type',
            header: 'Type',
            cell: ({ row }) => typeLabels[row.original.device_type] ?? row.original.device_type,
        },
        {
            id: 'location',
            header: 'Location',
            cell: ({ row }) => row.original.location ?? '—',
        },
        {
            id: 'spec',
            header: 'Vendor / Model',
            cell: ({ row }) => [row.original.vendor, row.original.model].filter(Boolean).join(' ') || '—',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusTone[row.original.status] ?? 'secondary'}>{row.original.status}</Badge>
            ),
        },
        {
            id: 'connectivity',
            header: 'Connectivity',
            cell: ({ row }) =>
                row.original.connected ? (
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                        <Wifi className="size-4" /> Connected
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-destructive">
                        <WifiOff className="size-4" /> Disconnected
                    </span>
                ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Update Smart Device') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/smart-devices/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Delete Smart Device') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Smart Building" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Smart Building Integration"
                        description="Monitor connected devices — CCTV, access control, meters and more"
                    />
                    {can('Create Smart Device') && (
                        <Button asChild size="sm">
                            <Link href="/smart-devices/create">
                                <Plus className="mr-1 size-4" />
                                Register Device
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Devices" value={totals.total} icon={Cpu} hint={`${totals.maintenance} in maintenance`} />
                    <StatCard title="Online" value={totals.online} icon={ServerCog} tone="success" />
                    <StatCard title="Offline" value={totals.offline} icon={ServerCog} tone={totals.offline > 0 ? 'danger' : 'success'} />
                    <StatCard title="Disconnected" value={totals.disconnected} icon={WifiOff} tone={totals.disconnected > 0 ? 'warning' : 'success'} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Devices by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                            {deviceTypes.map((t) => (
                                <div
                                    key={t}
                                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                                >
                                    <span className="text-muted-foreground">{typeLabels[t] ?? t}</span>
                                    <span className="font-semibold tabular-nums">{summary[t] ?? 0}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={devices} searchKey="device_name" searchPlaceholder="Search by device name..." />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SmartBuildingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Smart Building', href: '/smart-devices' },
    ],
};
