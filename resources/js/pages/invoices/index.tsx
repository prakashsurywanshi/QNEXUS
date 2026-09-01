import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Invoice {
    id: number;
    rent_id: number | null;
    invoice_number: string | null;
    amount: number | null;
    status: string;
    due_date: string | null;
}

export default function InvoicesIndex({ invoices }: { invoices: Invoice[] }) {
    return (
        <>
            <Head title="Invoices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Invoices</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {invoices.length === 0 && (
                        <p className="text-muted-foreground">No invoices yet.</p>
                    )}
                    {invoices.map((inv) => (
                        <div key={inv.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{inv.invoice_number || `#${inv.id}`}</span>
                                <span className="text-muted-foreground text-sm">{inv.status}</span>
                            </div>
                            {inv.amount != null && <p className="text-muted-foreground mt-1 text-sm">₹{inv.amount}</p>}
                            {inv.due_date && <p className="text-muted-foreground text-sm">Due {inv.due_date}</p>}
                        </div>
                    ))}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[20vh] overflow-hidden rounded-xl border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}
