<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ChartOfAccount;
use App\Models\JournalVoucher;
use App\Models\JournalVoucherLine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class JournalVoucherController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/journal-vouchers/index', [
            'vouchers' => JournalVoucher::with(['creator'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/journal-vouchers/create', [
            'accounts' => ChartOfAccount::where('society_id', active_society_id())->where('is_active', true)->orderBy('account_name')->get(['id', 'account_code', 'account_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateVoucher($request);

        DB::transaction(function () use ($data) {
            $voucher = JournalVoucher::create([
                'society_id' => active_society_id(),
                'voucher_number' => $data['voucher_number'],
                'date' => $data['date'],
                'description' => $data['description'],
                'total_debit' => $data['total_debit'],
                'total_credit' => $data['total_credit'],
                'status' => $data['status'],
                'created_by' => auth()->id() ? (int) auth()->id() : 0,
            ]);

            foreach ($data['lines'] as $line) {
                if (empty($line['account_id'])) {
                    continue;
                }
                JournalVoucherLine::create([
                    'voucher_id' => $voucher->id,
                    'account_id' => $line['account_id'],
                    'debit' => $line['debit'] ?? 0,
                    'credit' => $line['credit'] ?? 0,
                    'description' => $line['description'] ?? null,
                ]);
            }
        });

        AuditLog::record("Created journal voucher: {$data['voucher_number']}");

        return redirect()->route('journal-vouchers.index');
    }

    public function edit(JournalVoucher $journalVoucher): Response
    {
        return Inertia::render('accounting/journal-vouchers/edit', [
            'voucher' => $journalVoucher->load(['lines', 'creator']),
            'accounts' => ChartOfAccount::where('society_id', active_society_id())->where('is_active', true)->orderBy('account_name')->get(['id', 'account_code', 'account_name']),
        ]);
    }

    public function update(Request $request, JournalVoucher $journalVoucher): RedirectResponse
    {
        $data = $this->validateVoucher($request);

        DB::transaction(function () use ($data, $journalVoucher) {
            $journalVoucher->update([
                'voucher_number' => $data['voucher_number'],
                'date' => $data['date'],
                'description' => $data['description'],
                'total_debit' => $data['total_debit'],
                'total_credit' => $data['total_credit'],
                'status' => $data['status'],
            ]);

            $journalVoucher->lines()->delete();

            foreach ($data['lines'] as $line) {
                if (empty($line['account_id'])) {
                    continue;
                }
                JournalVoucherLine::create([
                    'voucher_id' => $journalVoucher->id,
                    'account_id' => $line['account_id'],
                    'debit' => $line['debit'] ?? 0,
                    'credit' => $line['credit'] ?? 0,
                    'description' => $line['description'] ?? null,
                ]);
            }
        });

        AuditLog::record("Updated journal voucher: {$data['voucher_number']}", $journalVoucher);

        return redirect()->route('journal-vouchers.index');
    }

    public function destroy(JournalVoucher $journalVoucher): RedirectResponse
    {
        AuditLog::record("Deleted journal voucher: {$journalVoucher->voucher_number}");
        $journalVoucher->lines()->delete();
        $journalVoucher->delete();

        return redirect()->route('journal-vouchers.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateVoucher(Request $request): array
    {
        return $request->validate([
            'voucher_number' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'description' => ['required', 'string'],
            'total_debit' => ['required', 'numeric', 'min:0'],
            'total_credit' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'submitted', 'approved', 'rejected'])],
            'lines' => ['array'],
            'lines.*.account_id' => ['nullable', 'exists:chart_of_accounts,id'],
            'lines.*.debit' => ['nullable', 'numeric', 'min:0'],
            'lines.*.credit' => ['nullable', 'numeric', 'min:0'],
            'lines.*.description' => ['nullable', 'string'],
        ]);
    }
}
