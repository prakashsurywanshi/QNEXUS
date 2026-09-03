import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/payments';

interface Payment {
    id: number;
    payment_method: string;
    amount: number;
    balance: number | null;
    transaction_id: string | null;
}

export default function PaymentsIndex({ payments }: { payments: Payment[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this payment?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Payments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Payments</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Payment
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {payments.length === 0 && <EmptyState icon={Plus} title="No payments yet" description="Record your first payment to get started." />}
                    {payments.map((p) => (
                        <div key={p.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">₹{p.amount}</span>
                                <span className="text-muted-foreground text-sm">{p.payment_method}</span>
                            </div>
                            {p.balance != null && <p className="text-muted-foreground mt-1 text-sm">Balance ₹{p.balance}</p>}
                            {p.transaction_id && <p className="text-muted-foreground text-sm">{p.transaction_id}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(p.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}