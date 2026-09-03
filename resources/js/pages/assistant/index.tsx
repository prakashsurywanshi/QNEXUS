import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCan } from '@/lib/permissions';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

function getXsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function AssistantIndex({
    suggestions,
}: {
    suggestions: string[];
}) {
    const can = useCan();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const canAsk = can('Show AI Assistant');

    const ask = (question?: string) => {
        const q = (question ?? input).trim();
        if (!q || loading || !canAsk) return;

        setMessages((prev) => [...prev, { role: 'user', content: q }]);
        setInput('');
        setLoading(true);

        fetch('/assistant/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getXsrfToken(),
            },
            body: JSON.stringify({ question: q }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Request failed');
                return res.json();
            })
            .then((data: { answer: string }) => {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
            })
            .catch(() => {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: 'Sorry, I could not fetch an answer right now. Please try again.' },
                ]);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Head title="AI Assistant" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    variant="small"
                    title="AI Assistant"
                    description="Ask questions about your society data — occupancy, finance, AMC, tickets and more"
                />

                {!canAsk ? (
                    <Card>
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                            You do not have permission to use the AI Assistant.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="flex min-h-0 flex-1 flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="size-5" />
                                    Ask QNEXUS
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <div className="flex flex-1 flex-col justify-center gap-3">
                                        <p className="text-sm text-muted-foreground">
                                            Try one of these questions:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => ask(s)}
                                                    className="rounded-full border px-3 py-1.5 text-left text-sm hover:bg-accent"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((m, i) => (
                                        <div
                                            key={i}
                                            className={
                                                m.role === 'user'
                                                    ? 'self-end max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                                                    : 'self-start max-w-[85%] whitespace-pre-line rounded-lg border px-3 py-2 text-sm'
                                            }
                                        >
                                            {m.content}
                                        </div>
                                    ))
                                )}
                                {loading && (
                                    <div className="self-start rounded-lg border px-3 py-2 text-sm text-muted-foreground">
                                        Thinking…
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                ask();
                            }}
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your society…"
                                disabled={loading}
                            />
                            <Button type="submit" disabled={loading || !input.trim()}>
                                <Send className="size-4" />
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}

AssistantIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'AI Assistant', href: '/assistant' },
    ],
};
