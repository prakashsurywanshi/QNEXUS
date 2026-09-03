import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Meeting {
    id: number;
    title: string;
    description: string | null;
    meeting_date: string;
    meeting_time: string;
    location: string | null;
    status: string;
    organized_by: number | null;
    organizer: { id: number; name: string } | null;
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function MeetingIndex({ meetings }: { meetings: Meeting[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this meeting?')) {
            deleteForm(`/meetings/${id}`);
        }
    };

    const columns: ColumnDef<Meeting>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
        },
        {
            accessorKey: 'meeting_date',
            header: 'Date',
            cell: ({ row }) => row.original.meeting_date ? new Date(row.original.meeting_date).toLocaleDateString() : '—',
        },
        {
            accessorKey: 'meeting_time',
            header: 'Time',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant="outline" className={statusColors[row.original.status] ?? ''}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => row.original.location ?? '—',
        },
        {
            id: 'organized_by',
            header: 'Organized By',
            cell: ({ row }) => row.original.organizer?.name ?? '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Meeting') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/meetings/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Meeting') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Meetings" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Meetings"
                        description="Manage society meetings and minutes"
                    />
                    {can('Create Meeting') && (
                        <Button asChild size="sm">
                            <Link href="/meetings/create">
                                <Plus className="mr-1 size-4" />
                                New Meeting
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={meetings}
                    searchKey="title"
                    searchPlaceholder="Search by title..."
                />
            </div>
        </>
    );
}

MeetingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Meetings', href: '/meetings' },
    ],
};
