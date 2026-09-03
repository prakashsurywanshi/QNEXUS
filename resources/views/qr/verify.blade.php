<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>QR Verification — QNEXUS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100">
    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            @if ($valid)
                @if ($status === 'expired' || $status === 'rejected')
                    <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 class="text-2xl font-bold text-red-600">Not Valid</h1>
                    <p class="mt-2 text-slate-600">This {{ strtolower($type) }} is {{ $status }}.</p>
                @else
                    <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 class="text-2xl font-bold text-green-600">Valid</h1>
                    <p class="mt-2 text-slate-600">This {{ strtolower($type) }} is approved for entry.</p>
                @endif

                <div class="mt-6 rounded-xl bg-slate-50 p-4 text-left">
                    <div class="flex justify-between py-1"><span class="text-sm font-medium text-slate-500">Type</span><span class="text-sm font-semibold text-slate-800">{{ $type }}</span></div>
                    <div class="flex justify-between py-1"><span class="text-sm font-medium text-slate-500">Reference</span><span class="text-sm font-semibold text-slate-800">{{ $reference }}</span></div>
                    <div class="flex justify-between py-1"><span class="text-sm font-medium text-slate-500">Status</span><span class="text-sm font-semibold text-slate-800 capitalize">{{ $status ?? 'approved' }}</span></div>
                    @if ($item)
                        <div class="flex justify-between py-1"><span class="text-sm font-medium text-slate-500">Detail</span><span class="text-sm font-semibold text-slate-800">{{ $item }}</span></div>
                    @endif
                </div>
            @else
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-red-600">Invalid QR Code</h1>
                <p class="mt-2 text-slate-600">This QR code could not be validated.</p>
            @endif
        </div>
    </div>
</body>
</html>
