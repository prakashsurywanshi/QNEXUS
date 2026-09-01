import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/invoices';

interface Invoice {
    id: number;
    invoice_number: string;
    total_amount: number | null;
    status: string;
    due_date: string | null;
}

export default function InvoicesIndex({ invoices }: { invoices: Invoice[] }) {
    const { delete: deleteForm } = useForm();
    const color: Record<string, string> = {
        paid: 'text-green-600',
        partial: 'text-amber-600',
        overdue: 'text-red-600',
        pending: 'text-blue-600',
        cancelled: 'text-muted-foreground',
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this invoice?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Invoices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Invoices</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Invoice
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {invoices.length === 0 && (
                        <p className="text-muted-foreground">No invoices yet.</p>
                    )}
                    {invoices.map((inv) => (
                        <div key={inv.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{inv.invoice_number || `#${inv.id}`}</span>
                                <span className={`text-sm ${color[inv.status] ?? 'text-muted-foreground'}`}>{inv.status}</span>
                            </div>
                            {inv.total_amount != null && <p className="text-muted-foreground mt-1 text-sm">₹{inv.total_amount}</p>}
                            {inv.due_date && <p className="text-muted-foreground text-sm">Due {inv.due_date}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(inv.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(inv.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
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