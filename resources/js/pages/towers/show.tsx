import { Head } from '@inertiajs/react';

interface Floor {
    id: number;
    floor_number: number;
}

interface Tower {
    id: number;
    tower_name: string;
    floors: Floor[];
}

export default function TowersShow({ tower }: { tower: Tower }) {
    return (
        <>
            <Head title={tower.tower_name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">{tower.tower_name}</h1>
                <p className="text-muted-foreground">Floors in this tower</p>
                <ul className="grid gap-2 md:grid-cols-3">
                    {tower.floors.map((floor) => (
                        <li
                            key={floor.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-3"
                        >
                            Floor {floor.floor_number}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
