'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyVoucherButton({ voucherCode }: { voucherCode: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(voucherCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API bisa gagal di beberapa browser/kondisi (mis. tanpa HTTPS) —
            // diamkan secara graceful, tombol tetap bisa dicoba lagi.
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-2.5 rounded-lg transition-all hover:bg-white/10 text-white/45 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 shrink-0"
            aria-label={copied ? 'Kode voucher disalin' : 'Salin kode voucher'}
            title={copied ? 'Tersalin!' : 'Salin Kode Voucher'}
        >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
    );
}