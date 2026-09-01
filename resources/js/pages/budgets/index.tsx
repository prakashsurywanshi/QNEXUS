import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Budget {
    id: number;
    fiscal_year: string;
    budgeted_amount: number;
    actual_amount: number;
    variance: number;
}

export default function BudgetsIndex({ budgets }: { budgets: Budget[] }) {
    return (
        <>
            <Head title="Budgets" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Budgets</h1>
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
