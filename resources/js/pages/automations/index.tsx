import { Head, router, useForm } from '@inertiajs/react';
import { Play, Plus, Power, Trash2 } from 'lucide-react';
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
import { dashboard } from '@/routes';
import { index as automationsIndex } from '@/routes/automations';

interface AutomationItem {
    id: number;
    name: string;
    trigger_event: string;
    action: string;
    is_active: boolean;
}

interface AutomationRunItem {
    id: number;
    subject_type: string;
    action: string;
    fired_at: string;
    automation: { name: string } | null;
}

const triggerLabels: Record<string, string> = {
    visitor_qr_expires: 'Visitor QR Expires',
    complaint_sla: 'Complaint Exceeds SLA',
    maintenance_overdue: 'Maintenance Overdue',
    amc_expiring: 'AMC Expiring',
    lease_expiring: 'Lease Expiring',
};

const actionLabels: Record<string, string> = {
    notify_facility_manager: 'Notify Facility Manager',
    notify_accounts: 'Notify Accounts',
    deactivate_access: 'Deactivate Access',
    send_reminder: 'Send Reminder',
    escalate_manager: 'Escalate to Manager',
};

export default function AutomationsIndex({ automations, recentRuns, triggerEvents, actions, status }: { automations: AutomationItem[]; recentRuns: AutomationRunItem[]; triggerEvents: string[]; actions: string[]; status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        trigger_event: 'visitor_qr_expires',
        trigger_conditions: '',
        action: 'notify_facility_manager',
        action_config: '',
        is_active: true,
    });

    const toggle = (id: number) => {
        router.patch(`/automations/${id}/toggle`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this automation rule?')) {
            router.delete(`/automations/${id}`);
        }
    };

    const handleRun = () => {
        router.post('/automations/run', {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Automation" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Automation" description="Configure trigger-action workflows for operational rules." />

                {status && (
                    <div className="rounded-lg border bg-muted px-4 py-2 text-sm text-foreground">{status}</div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Rules are evaluated hourly by the automation scheduler, or on demand.</p>
                    <Button variant="outline" size="sm" onClick={handleRun}>
                        <Play className="mr-2 size-4" />
                        Run Now
                    </Button>
                </div>

                <div className="space-y-3 rounded-xl border p-4">
                    <h2 className="font-medium">New Automation Rule</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post('/automations', { preserveScroll: true });
                        }}
                        className="space-y-4"
                    >
                        <div className="grid gap-2 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="e.g. AMC expiring reminder" />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Trigger</Label>
                                <Select value={data.trigger_event} onValueChange={(v) => setData('trigger_event', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {triggerEvents.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {triggerLabels[t] ?? t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.trigger_event} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Action</Label>
                                <Select value={data.action} onValueChange={(v) => setData('action', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {actions.map((a) => (
                                            <SelectItem key={a} value={a}>
                                                {actionLabels[a] ?? a}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.action} />
                            </div>
                        </div>
                        <Button type="submit" disabled={processing}>
                            <Plus className="mr-2 size-4" />
                            Add Rule
                        </Button>
                    </form>
                </div>

                <div className="grid gap-3">
                    {automations.length === 0 && (
                        <p className="text-muted-foreground">No automation rules configured yet.</p>
                    )}
                    {automations.map((a) => (
                        <div key={a.id} className={`flex items-center justify-between rounded-xl border p-4 ${a.is_active ? '' : 'opacity-60'}`}>
                            <div>
                                <p className="font-medium">{a.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    IF <span className="font-medium">{triggerLabels[a.trigger_event] ?? a.trigger_event}</span>
                                    {' → '}
                                    <span className="font-medium">{actionLabels[a.action] ?? a.action}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant={a.is_active ? 'default' : 'outline'} size="sm" onClick={() => toggle(a.id)}>
                                    <Power className="mr-2 size-4" />
                                    {a.is_active ? 'Active' : 'Disabled'}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} className="text-destructive">
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {recentRuns.length > 0 && (
                    <div className="rounded-xl border p-4">
                        <h2 className="mb-3 font-medium">Recent Executions</h2>
                        <div className="divide-y">
                            {recentRuns.map((r) => (
                                <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                                    <div>
                                        <p className="font-medium">{r.automation?.name ?? 'Automation rule'}</p>
                                        <p className="text-muted-foreground">{actionLabels[r.action] ?? r.action} · {r.subject_type.split('\\').pop()}</p>
                                    </div>
                                    <span className="text-muted-foreground">{new Date(r.fired_at).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AutomationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Automation', href: automationsIndex() },
    ],
};
