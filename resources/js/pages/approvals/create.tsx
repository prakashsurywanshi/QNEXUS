import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

const typeLabels: Record<string, string> = {
    expense: 'Expense',
    vendor: 'Vendor',
    refund: 'Refund',
    amenity: 'Amenity',
    access: 'Access',
    purchase: 'Purchase',
    maintenance: 'Maintenance Work',
};

interface StepInput {
    title: string;
    description: string;
}

export default function CreateApproval({ types }: { types: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'expense',
        title: '',
        description: '',
        steps: [] as StepInput[],
    });

    const addStep = () => {
        setData('steps', [...data.steps, { title: '', description: '' }]);
    };

    const removeStep = (index: number) => {
        setData('steps', data.steps.filter((_, i) => i !== index));
    };

    const updateStep = (index: number, field: keyof StepInput, value: string) => {
        setData(
            'steps',
            data.steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
        );
    };

    return (
        <>
            <Head title="New Approval Request" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="New Approval Request" description="Submit a request for approval" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/approvals');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {typeLabels[t] ?? t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            placeholder="e.g. Approve annual lift maintenance expense"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Additional details..."
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Approval Steps (optional)</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addStep}>
                                <Plus className="mr-1 size-4" />
                                Add Step
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Define an ordered chain of approvals. Each step must be approved before the next one activates.
                        </p>
                        {data.steps.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No steps defined — a single approver will finalise this request.
                            </p>
                        )}
                        {data.steps.map((step, index) => (
                            <div key={index} className="flex flex-col gap-2 rounded-lg border p-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">Step {index + 1}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="ml-auto text-destructive"
                                        onClick={() => removeStep(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <Input
                                    value={step.title}
                                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                                    placeholder="Step title (e.g. Manager approval)"
                                />
                                <Input
                                    value={step.description}
                                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                                    placeholder="Optional notes for this step"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Submit Request
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateApproval.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Approvals', href: '/approvals' },
        { title: 'New', href: '/approvals/create' },
    ],
};
