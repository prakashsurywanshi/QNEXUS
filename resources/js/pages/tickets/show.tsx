import { useForm } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Reply {
    id: number;
    user?: { id: number; name: string } | null;
    message: string;
    created_at: string | null;
}

interface Ticket {
    id: number;
    ticket_number: number | null;
    subject: string | null;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    user?: { id: number; name: string } | null;
    ticketType?: { id: number; type_name: string } | null;
    reply?: Reply[];
}

export default function TicketShow({ ticket }: { ticket: Ticket }) {
    const { data, setData, post, processing, errors } = useForm<{ message: string }>({
        message: '',
    });

    return (
        <>
            <Head title={ticket.subject ?? 'Ticket'} />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title={ticket.subject ?? 'Untitled'}
                        description={`#${ticket.ticket_number ?? ticket.id} · ${ticket.status} · ${
                            ticket.user?.name ?? '—'
                        } · ${ticket.ticketType?.type_name ?? 'Unassigned type'}`}
                    />
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/tickets/${ticket.id}/edit`}>
                            <Pencil /> Edit
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Conversation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-5">
                        {!ticket.reply || ticket.reply.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No replies yet.</p>
                        ) : (
                            ticket.reply.map((reply) => (
                                <div key={reply.id} className="rounded-lg border p-3">
                                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="font-medium">{reply.user?.name ?? 'User'}</span>
                                        <span>{reply.created_at ?? ''}</span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(`/tickets/${ticket.id}/reply`);
                    }}
                    className="space-y-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="message">Add a reply</Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            required
                            placeholder="Write a reply..."
                        />
                        <InputError message={errors.message} />
                    </div>
                    <Button disabled={processing}>Post reply</Button>
                </form>
            </div>
        </>
    );
}