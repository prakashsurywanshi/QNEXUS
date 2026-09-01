import { Head, Link } from '@inertiajs/react';

interface Floor {
    id: number;
    floor_name: string;
    tower_id: number;
}

interface Tower {
    id: number;
    tower_name: string;
}

export default function FloorsIndex({ tower, floors }: { tower: Tower; floors: Floor[] }) {
    return (
        <>
            <Head title={`${tower.tower_name} · Floors`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Link
                    href={`/towers/${tower.id}`}
                    className="text-muted-foreground text-sm hover:underline"
                >
                    ← {tower.tower_name}
                </Link>
                <h1 className="text-xl font-semibold">Floors</h1>
                <ul className="grid gap-2 md:grid-cols-3">
                    {floors.length === 0 && (
                        <p className="text-muted-foreground">No floors in this tower yet.</p>
                    )}
                    {floors.map((floor) => (
                        <li
                            key={floor.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-3"
                        >
                            {floor.floor_name}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
