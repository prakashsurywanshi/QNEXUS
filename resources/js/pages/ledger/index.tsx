import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Entry {
    id: number;
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

export default function LedgerIndex({ entries }: { entries: Entry[] }) {
    return (
        <>
            <Head title="Ledger" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">General Ledger</h1>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="text-muted-foreground border-b">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium">Date</th>
                                <th className="px-3 py-2 text-left font-medium">Description</th>
                                <th className="px-3 py-2 text-right font-medium">Debit</th>
                                <th className="px-3 py-2 text-right font-medium">Credit</th>
                                <th className="px-3 py-2 text-right font-medium">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length === 0 && (
                                <tr><td colSpan={5} className="text-muted-foreground px-3 py-4 text-center">No ledger entries yet.</td></tr>
                            )}
                            {entries.map((e) => (
                                <tr key={e.id} className="hover:bg-muted/50 border-b">
                                    <td className="px-3 py-2">{e.date}</td>
                                    <td className="px-3 py-2">{e.description}</td>
                                    <td className="px-3 py-2 text-right">{e.debit}</td>
                                    <td className="px-3 py-2 text-right">{e.credit}</td>
                                    <td className="px-3 py-2 text-right">{e.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[20vh] overflow-hidden rounded-xl border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}
