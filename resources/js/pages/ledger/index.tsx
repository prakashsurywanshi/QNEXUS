import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/ledger';

interface Entry {
    id: number;
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

export default function LedgerIndex({ entries }: { entries: Entry[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this ledger entry?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Ledger" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">General Ledger</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Entry
                        </Link>
                    </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="text-muted-foreground border-b">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium">Date</th>
                                <th className="px-3 py-2 text-left font-medium">Description</th>
                                <th className="px-3 py-2 text-right font-medium">Debit</th>
                                <th className="px-3 py-2 text-right font-medium">Credit</th>
                                <th className="px-3 py-2 text-right font-medium">Balance</th>
                                <th className="px-3 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length === 0 && (
                                <tr><td colSpan={6}><EmptyState icon={Plus} title="No ledger entries yet" description="Add your first entry to get started." /></td></tr>
                            )}
                            {entries.map((e) => (
                                <tr key={e.id} className="hover:bg-muted/50 border-b">
                                    <td className="px-3 py-2">{e.date}</td>
                                    <td className="px-3 py-2">{e.description}</td>
                                    <td className="px-3 py-2 text-right">{e.debit}</td>
                                    <td className="px-3 py-2 text-right">{e.credit}</td>
                                    <td className="px-3 py-2 text-right">{e.balance}</td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={edit(e.id).url}>
                                                    <Pencil /> Edit
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
                                                <Trash2 /> Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}
