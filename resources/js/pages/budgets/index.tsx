import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/budgets';

interface Budget {
    id: number;
    fiscal_year: string;
    budgeted_amount: number;
    actual_amount: number;
    variance: number;
}

export default function BudgetsIndex({ budgets }: { budgets: Budget[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this budget?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Budgets" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Budgets</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Budget
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {budgets.length === 0 && (
                        <p className="text-muted-foreground">No budgets yet.</p>
                    )}
                    {budgets.map((b) => (
                        <div key={b.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{b.fiscal_year}</span>
                            <p className="text-muted-foreground mt-1 text-sm">Budgeted ₹{b.budgeted_amount}</p>
                            <p className="text-muted-foreground text-sm">Actual ₹{b.actual_amount}</p>
                            <p className="text-muted-foreground text-sm">Variance ₹{b.variance}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(b.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(b.id)}>
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