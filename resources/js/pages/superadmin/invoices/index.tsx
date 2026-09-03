import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes/superadmin';
import { index as invoicesIndex } from '@/routes/superadmin/invoices';

type Invoice = {
    id: number;
    invoice_id: string | null;
    amount: number | null;
    gateway_name: string | null;
    status: string | null;
    pay_date: string | null;
    society: { id: number; name: string } | null;
    package: { id: number; package_name: string } | null;
};

export default function InvoicesIndex({ invoices }: { invoices: Invoice[] }) {
    return (
        <>
            <Head title="Invoices" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Invoices" description="All global invoices raised across the platform." />

                <Card>
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>{invoices.length} invoices on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {invoices.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No invoices raised yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="pb-2 font-medium">Invoice</th>
                                            <th className="pb-2 font-medium">Society</th>
                                            <th className="pb-2 font-medium">Package</th>
                                            <th className="pb-2 font-medium">Gateway</th>
                                            <th className="pb-2 font-medium">Amount</th>
                                            <th className="pb-2 font-medium">Status</th>
                                            <th className="pb-2 font-medium">Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id} className="border-b">
                                                <td className="py-3">
                                                    <span className="inline-flex items-center gap-1 font-medium">
                                                        <FileText className="h-3 w-3 text-muted-foreground" />
                                                        {invoice.invoice_id ?? `#${invoice.id}`}
                                                    </span>
                                                </td>
                                                <td className="py-3">{invoice.society?.name ?? '—'}</td>
                                                <td className="py-3">
                                                    {invoice.package?.package_name ?? '—'}
                                                </td>
                                                <td className="py-3 capitalize">{invoice.gateway_name ?? 'offline'}</td>
                                                <td className="py-3 font-medium">
                                                    {invoice.amount != null ? `$${invoice.amount}` : '—'}
                                                </td>
                                                <td className="py-3 capitalize">
                                                    <span
                                                        className={
                                                            invoice.status === 'active'
                                                                ? 'text-green-600'
                                                                : 'text-muted-foreground'
                                                        }
                                                    >
                                                        {invoice.status ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-muted-foreground">
                                                    {invoice.pay_date
                                                        ? new Date(invoice.pay_date).toLocaleDateString()
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Invoices', href: invoicesIndex() },
    ],
};