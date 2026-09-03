import { Head } from '@inertiajs/react';
import { Download, QrCode } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index as gatepassesIndex } from '@/routes/gatepasses';

interface Gatepass {
    id: number;
    item_description: string;
    quantity: number;
    gatepass_type: 'in' | 'out';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export default function GatepassQr({ gatepass, qrDataUri, verifyUrl }: { gatepass: Gatepass; qrDataUri: string; verifyUrl: string }) {
    return (
        <>
            <Head title={`Gatepass QR #${gatepass.id}`} />
            <div className="flex h-full flex-1 flex-col items-center gap-6 p-4">
                <Heading
                    variant="small"
                    title={`Gatepass QR #${gatepass.id}`}
                    description="Scan this QR code to validate the gatepass at the gate."
                />

                <div className="flex flex-col items-center gap-4 rounded-xl border p-8">
                    <img src={qrDataUri} alt="Gatepass QR code" className="h-64 w-64" />

                    <div className="text-center">
                        <p className="font-medium">{gatepass.item_description}</p>
                        <p className="text-muted-foreground text-sm">
                            Qty {gatepass.quantity} · {gatepass.gatepass_type} · {gatepass.status}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a href={qrDataUri} download={`gatepass-${gatepass.id}.png`}>
                            <Button variant="outline">
                                <Download className="mr-2 size-4" />
                                Download QR
                            </Button>
                        </a>
                        <Button asChild variant="outline">
                            <a href={verifyUrl} target="_blank" rel="noreferrer">
                                <QrCode className="mr-2 size-4" />
                                Test Verify
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

GatepassQr.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Gatepasses', href: gatepassesIndex() },
        { title: 'QR', href: '#' },
    ],
};
