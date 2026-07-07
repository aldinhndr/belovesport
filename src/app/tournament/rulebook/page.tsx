// Path: src/app/rulebook/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, BookOpen, Search, ChevronDown, Gavel,
    Network, Clock, MessageSquare, Ban, WifiOff,
    Edit3, AlertTriangle, Megaphone, ShieldAlert, Trophy
} from 'lucide-react';

const RULES_DATA = [
    {
        id: '1',
        title: 'I. KETENTUAN UMUM',
        icon: Gavel,
        searchTerms: 'ketentuan umum akun joki 1 user 1 team nama logo diskualifikasi',
        content: (
            <ol className="list-decimal pl-5 space-y-2.5 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                <li>Turnamen menggunakan game eFootball versi terbaru (update resmi Konami).</li>
                <li>Setiap peserta wajib menggunakan akun pribadi.</li>
                <li>Satu akun hanya diperbolehkan mewakili satu tim (1 User = 1 Team).</li>
                <li className="text-rose-500 font-bold dark:text-rose-400">Dilarang keras menggunakan akun joki atau bermain untuk lebih dari satu tim.</li>
                <li>Nama tim dan logo yang digunakan WAJIB sesuai saat pendaftaran dan tidak boleh diubah.</li>
                <li>Pelanggaran terhadap ketentuan umum dapat berujung pada sanksi hingga diskualifikasi.</li>
            </ol>
        )
    },
    {
        id: '2',
        title: 'II. SISTEM PERTANDINGAN',
        icon: Network,
        searchTerms: 'sistem pertandingan grup gugur poin menang seri kalah jadwal',
        content: (
            <ul className="list-disc pl-5 space-y-2.5 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                <li><strong>Babak Grup:</strong> Sistem Round Robin (2 Leg).</li>
                <li><strong>Babak Gugur:</strong> Sistem 2 Leg (Home & Away).</li>
                <li><strong>Perolehan Poin:</strong>
                    <ul className="list-circle pl-5 mt-1.5 space-y-1 font-mono text-xs">
                        <li className="text-emerald-500 font-bold">Menang (W) = 3 Poin</li>
                        <li className="text-amber-500 font-bold">Seri (D) = 1 Poin</li>
                        <li className="text-rose-500 font-bold">Kalah (L) = 0 Poin</li>
                    </ul>
                </li>
                <li>Jadwal resmi pertandingan hanya yang tercantum di website turnamen.</li>
                <li>Peserta wajib menyesuaikan jadwal pribadi dengan jadwal turnamen.</li>
            </ul>
        )
    },
    {
        id: '3',
        title: 'III. WAKTU & DEADLINE',
        icon: Clock,
        searchTerms: 'waktu deadline jam aktif kick off terlambat wo',
        content: (
            <div className="space-y-4">
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-500 text-center font-black font-mono tracking-widest text-xs">
                    JAM AKTIF: 08.00 – 22.00 WIB
                </div>
                <ol className="list-decimal pl-5 space-y-2.5 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                    <li>Kick Off Matchday dimulai pukul <strong>07.00 WIB</strong>.</li>
                    <li>Deadline Matchday berakhir pukul <strong>23.59 WIB</strong>.</li>
                    <li>Segala bentuk komunikasi, konfirmasi, dan pertandingan dianjurkan dilakukan pada jam aktif.</li>
                    <li>Keterlambatan lebih dari 2 jam dari deadline dapat berujung WO.</li>
                </ol>
            </div>
        )
    },
    {
        id: '4',
        title: 'IV. KOMUNIKASI & RESPON',
        icon: MessageSquare,
        searchTerms: 'komunikasi respon hubungi lawan sah batas jam',
        content: (
            <ol className="list-decimal pl-5 space-y-2.5 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                <li>Setiap peserta WAJIB menghubungi lawan minimal 2 kali sebelum deadline.</li>
                <li>Respon dianggap SAH apabila dilakukan sebelum pukul 22.00 WIB.</li>
                <li className="text-amber-500 font-bold">Balasan di atas pukul 22.00 WIB tidak dianggap sebagai respon valid.</li>
                <li>Balasan setelah deadline Matchday (23.59 WIB) dianggap tidak sah.</li>
                <li>Alasan pribadi seperti tidur, offline, atau kesibukan tidak dapat dijadikan pembelaan (Kecuali sudah konfirmasi kepada Admin).</li>
            </ol>
        )
    },
    {
        id: '5',
        title: 'V. SOP WALK OVER (WO)',
        icon: Ban,
        searchTerms: 'walk over wo no respon bukti ss 3-0',
        content: (
            <div className="space-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Jika lawan tidak merespon (No Respon):</p>
                <ol className="list-decimal pl-5 space-y-2.5">
                    <li>Peserta wajib mengirim pesan konfirmasi formal kepada lawan (Sertakan Matchday & Deadline).</li>
                    <li>Screenshot chat wajib memperlihatkan waktu dan status tidak dibalas.</li>
                    <li>Bukti dikirim ke admin sebelum deadline.</li>
                    <li>Jika lawan tidak merespon hingga deadline, admin berhak menetapkan WO.</li>
                    <li className="font-bold text-brand-primary">Skor WO ditetapkan 3–0.</li>
                    <li>Jika kedua tim tidak melakukan komunikasi, kedua tim dianggap WO (0 poin).</li>
                </ol>
            </div>
        )
    },
    {
        id: '6',
        title: 'VI. ATURAN DISCONNECT (DC)',
        icon: WifiOff,
        searchTerms: 'disconnect dc putus koneksi half time ulang bukti',
        content: (
            <div className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <p><strong>Definisi:</strong> Terputusnya koneksi yang menyebabkan laga berhenti.</p>

                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl text-amber-600 dark:text-amber-500">
                    <strong className="block mb-1 text-xs uppercase tracking-wider font-bold">1. DC SEBELUM HALF TIME (0-45 Menit)</strong>
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                        <li>Pertandingan WAJIB diulang dari awal.</li>
                        <li>Skor sebelumnya dianggap tidak berlaku.</li>
                        <li>Pengulangan harus di Matchday yang sama.</li>
                    </ul>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl text-rose-500">
                    <strong className="block mb-1 text-xs uppercase tracking-wider font-bold">2. DC SETELAH HALF TIME (45-90 Menit)</strong>
                    Keputusan Admin berdasarkan:<br />
                    - Skor saat DC terjadi.<br />
                    - Kondisi pertandingan & Bukti.<br />
                    <em className="text-[11px] mt-1 block font-bold text-zinc-400 dark:text-zinc-500">* Admin berhak memutuskan: Lanjut sisa waktu, Ulang, atau Skor Akhir.</em>
                </div>

                <div className="text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white block text-xs uppercase tracking-wider mb-0.5">3. DC Berulang (Akumulatif)</strong>
                    Jika satu tim mengalami DC sebanyak 3 kali dalam satu Matchday, tim tersebut <strong className="text-rose-500">DINYATAKAN WO</strong>.
                </div>
                <div className="text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white block text-xs uppercase tracking-wider mb-0.5">4. Bukti Wajib</strong>
                    Setiap klaim DC WAJIB disertai bukti (screenshot / video). Tanpa bukti → klaim DITOLAK.
                </div>
            </div>
        )
    },
    {
        id: '7',
        title: 'VII. INPUT SKOR',
        icon: Edit3,
        searchTerms: 'input skor lapor koreksi salah',
        content: (
            <ol className="list-decimal pl-5 space-y-2.5 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                <li>Skor wajib dilaporkan sebelum deadline Matchday.</li>
                <li>Salah input skor dapat dikoreksi maksimal 1x24 jam dengan bukti valid.</li>
                <li>Jika website tertutup dan skor belum dilaporkan, match dianggap tidak sah atau silahkan chat Admin.</li>
                <li>Admin berhak menetapkan WO, No Match, atau skor final jika telat input.</li>
            </ol>
        )
    },
    {
        id: '8',
        title: 'VIII. CHEATING & FAIR PLAY',
        icon: AlertTriangle,
        searchTerms: 'cheating fair play bug abuse lag pause backpass sanksi',
        content: (
            <div className="space-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <p className="text-rose-500 font-bold flex items-center gap-2 text-xs uppercase tracking-wider"><ShieldAlert size={14} /> DILARANG KERAS:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Bug abuse</li>
                    <li>Manipulasi jaringan (Lag cheating)</li>
                    <li>Pause spam (mengganggu konsentrasi)</li>
                    <li>Time wasting berlebihan (Backpass berlebihan di area sendiri)</li>
                    <li>Aplikasi pihak ketiga</li>
                </ul>
                <p className="mt-3 bg-rose-500/5 text-rose-500 border border-rose-500/20 p-2.5 rounded-xl text-xs font-bold text-center">
                    SANKSI: Diskualifikasi langsung & Blacklist dari turnamen berikutnya.
                </p>
            </div>
        )
    },
    {
        id: '9',
        title: 'IX. PROTES & SENGKETA',
        icon: Megaphone,
        searchTerms: 'protes sengketa bukti video final mutlak',
        content: (
            <ol className="list-decimal pl-5 space-y-2.5 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                <li>Protes hanya diterima maksimal 1x24 jam setelah match.</li>
                <li>Protes wajib disertai bukti sah (Video/Screenshot).</li>
                <li className="font-bold text-brand-primary">Keputusan admin bersifat FINAL dan tidak dapat diganggu gugat.</li>
            </ol>
        )
    }
];

export default function RulebookPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState<string[]>(['1']);

    const filteredRules = useMemo(() => {
        if (!searchQuery.trim()) return RULES_DATA;
        const query = searchQuery.toLowerCase();
        return RULES_DATA.filter(rule =>
            rule.title.toLowerCase().includes(query) ||
            rule.searchTerms.includes(query)
        );
    }, [searchQuery]);

    useMemo(() => {
        if (searchQuery.trim().length > 0) {
            setOpenItems(filteredRules.map(r => r.id));
        } else if (openItems.length > 1) {
            setOpenItems(['1']);
        }
    }, [searchQuery, filteredRules]);

    const toggleAccordion = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0a09] text-zinc-900 dark:text-zinc-50 pb-24 flex flex-col antialiased">

            {/* ── BACKGROUND GLOW LAYER PREMIUM ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-primary/5 via-brand-gold/5 to-transparent pointer-events-none blur-3xl z-0" />

            {/* ── SUB-HEADER BARIS UTAMA ── */}
            <div className="relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
                    <Link href="/profil"
                        className="p-2.5 rounded-xl transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand-gold dark:hover:border-brand-gold shadow-sm group">
                        <ArrowLeft size={16} className="text-zinc-500 group-hover:text-brand-primary transition-colors" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-brand-primary" />
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white font-mono">
                                Rules <span className="text-brand-primary">& SOP</span>
                            </h1>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 flex items-center gap-1.5 font-medium">
                            <Trophy size={12} className="text-brand-gold shrink-0" />
                            Aturan dan Regulasi Resmi Turnamen BELOVESPORT
                        </p>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ARENA ── */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4 mt-6 flex-1 flex flex-col">

                {/* KOLOM PENCARIAN */}
                <div className="relative mb-6 shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search size={14} className="text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari aturan spesifik (Cth: WO, DC, Poin)..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all shadow-sm"
                    />
                </div>

                {/* DAFTAR ACCORDION */}
                <div className="space-y-3.5">
                    {filteredRules.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">Tidak ada poin regulasi yang cocok dengan kata kunci Koko.</p>
                        </div>
                    ) : (
                        filteredRules.map((rule) => {
                            const isOpen = openItems.includes(rule.id);
                            const Icon = rule.icon;

                            return (
                                <div key={rule.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                                    <button
                                        onClick={() => toggleAccordion(rule.id)}
                                        className={`w-full flex items-center justify-between px-5 py-4 transition-colors focus:outline-none ${isOpen
                                                ? 'bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/60'
                                                : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Icon size={16} className={isOpen ? 'text-brand-primary' : 'text-zinc-400 dark:text-zinc-500'} />
                                            <span className={`font-bold font-mono text-xs sm:text-sm tracking-wide ${isOpen ? 'text-brand-primary' : 'text-zinc-800 dark:text-zinc-200'
                                                }`}>
                                                {rule.title}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200">
                                            {rule.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* FOOTER DISCLAIMER */}
                <div className="mt-12 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-500 space-y-2 px-4 leading-relaxed">
                    <p>Admin berhak menunda, menjadwal ulang, atau menghentikan turnamen apabila terjadi gangguan di luar kendali panitia (Force Majeure).</p>
                    <p className="font-bold text-zinc-700 dark:text-zinc-400">Dengan mengikuti turnamen ini, peserta dianggap telah menyetujui seluruh aturan dan keputusan panitia tanpa syarat.</p>
                </div>

            </div>
        </div>
    );
}