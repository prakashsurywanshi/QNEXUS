import { Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface CategoryPref {
    category: string;
    label: string;
    muted: boolean;
    snooze_until: string | null;
    suppressed: boolean;
    email_enabled: boolean;
    push_enabled: boolean;
    sms_enabled: boolean;
}

const SNOOZE_OPTIONS = [
    { value: 'none', label: 'On (no snooze)' },
    { value: '1h', label: 'Snooze 1 hour' },
    { value: '24h', label: 'Snooze 24 hours' },
    { value: '1w', label: 'Snooze 1 week' },
    { value: 'forever', label: 'Snooze until resumed' },
];

function snoozeCurrent(pref: CategoryPref): string {
    if (pref.muted) return 'none';
    if (!pref.snooze_until) return 'none';
    const diffHours = (Date.now() - new Date(pref.snooze_until).getTime()) / 3_600_000;
    if (diffHours < 0 && diffHours > -3) return '1h';
    if (diffHours < 0 && diffHours > -27) return '24h';
    if (diffHours < 0 && diffHours > -170) return '1w';
    return 'forever';
}

export function NotificationPreferencesDialog() {
    const [open, setOpen] = useState(false);
    const [prefs, setPrefs] = useState<CategoryPref[] | null>(null);

    useEffect(() => {
        if (!open) return;
        setPrefs(null);
        fetch('/notifications/preferences', {
            headers: { Accept: 'application/json' },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load preferences');
                return res.json();
            })
            .then((data: { categories: CategoryPref[] }) => setPrefs(data.categories))
            .catch(() => setPrefs([]));
    }, [open]);

    const update = (category: string, patch: { muted?: boolean; snooze?: string; email_enabled?: boolean; push_enabled?: boolean; sms_enabled?: boolean }) => {
        setPrefs((prev) =>
            prev?.map((p) => {
                if (p.category !== category) return p;
                const next = { ...p, ...patch };
                if (patch.muted === true) next.snooze_until = null;
                if (patch.snooze && patch.snooze !== 'none') next.muted = false;
                return next;
            }) ?? prev,
        );
        fetch(`/notifications/preferences/${category}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify(patch),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings2 className="mr-2 size-4" />
                    Preferences
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Notification preferences</DialogTitle>
                    <DialogDescription>
                        Mute or snooze notifications per category. Snoozed categories stay quiet until the time passes.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {!prefs &&
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    {prefs?.map((pref) => {
                        const snooze = snoozeCurrent(pref);
                        return (
                            <div
                                key={pref.category}
                                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div>
                                        <Label className="font-medium">{pref.label}</Label>
                                        {pref.suppressed && (
                                            <p className="text-xs text-muted-foreground">
                                                {pref.muted ? 'Muted' : 'Snoozed'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={snooze}
                                        onValueChange={(value) => update(pref.category, { snooze: value })}
                                    >
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SNOOZE_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={pref.muted}
                                            onCheckedChange={(checked) => update(pref.category, { muted: checked })}
                                        />
                                        <span className="text-xs text-muted-foreground">Mute</span>
                                    </div>
                                </div>
                                {!pref.muted && (
                                    <div className="flex flex-wrap items-center gap-4 border-t pt-3 sm:border-t-0 sm:pt-0">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={pref.email_enabled}
                                                onCheckedChange={(checked) => update(pref.category, { email_enabled: checked })}
                                            />
                                            <span className="text-xs text-muted-foreground">Email</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={pref.push_enabled}
                                                onCheckedChange={(checked) => update(pref.category, { push_enabled: checked })}
                                            />
                                            <span className="text-xs text-muted-foreground">Push</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={pref.sms_enabled}
                                                onCheckedChange={(checked) => update(pref.category, { sms_enabled: checked })}
                                            />
                                            <span className="text-xs text-muted-foreground">SMS</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
