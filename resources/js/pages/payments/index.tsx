import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Payment {
    id: number;
    payment_method: string;
    amount: number;
    balance: number | null;
    transaction_id: string | null;
}

export default function PaymentsIndex({ payments }: { payments: Payment[] }) {
    return (
        <>
            <Head title="Payments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Payments</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {payments.length === 0 && (
                        <p className="text-muted-foreground">No payments yet.</p>
                    )}
                    {payments.map((p) => (
                        <div key={p.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">₹{p.amount}</span>
                                <span className="text-muted-foreground text-sm">{p.payment_method}</span>
                            </div>
                            {p.balance != null && <p className="text-muted-foreground mt-1 text-sm">Balance ₹{p.balance}</p>}
                            {p.transaction_id && <p className="text-muted-foreground text-sm">{p.transaction_id}</p>}
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
