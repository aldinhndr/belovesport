// Path: src/app/rulebook/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, BookOpen, Search, ChevronDown, Gavel,
    Network, Clock, MessageSquare, Ban, WifiOff,
    Edit3, AlertTriangle, Megaphone, ShieldAlert, Trophy
} from 'lucide-react';

// ─── DATA REGULASI (Sesuai dengan SOP NPEC Koko) ───
const RULES_DATA = [
    {
        id: '1',
        title: 'I. KETENTUAN UMUM',
        icon: Gavel,
        searchTerms: 'ketentuan umum akun joki 1 user 1 team nama logo diskualifikasi',
        content: (
            <ol className="list-decimal pl-5 space-y-2 text-brand-dark/80 font-medium text-sm">
                <li>Turnamen menggunakan game eFootball versi terbaru (update resmi Konami).</li>
                <li>Setiap peserta wajib menggunakan akun pribadi.</li>
                <li>Satu akun hanya diperbolehkan mewakili satu tim (1 User = 1 Team).</li>
                <li className="text-red-600 font-bold">Dilarang keras menggunakan akun joki atau bermain untuk lebih dari satu tim.</li>
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
            <ul className="list-disc pl-5 space-y-2 text-brand-dark/80 font-medium text-sm">
                <li><strong>Babak Grup:</strong> Sistem Round Robin (2 Leg).</li>
                <li><strong>Babak Gugur:</strong> Sistem 2 Leg (Home & Away).</li>
                <li><strong>Perolehan Poin:</strong>
                    <ul className="list-circle pl-5 mt-1 space-y-1">
                        <li className="text-emerald-600 font-bold">Menang (W) = 3 Poin</li>
                        <li className="text-amber-600 font-bold">Seri (D) = 1 Poin</li>
                        <li className="text-red-600 font-bold">Kalah (L) = 0 Poin</li>
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
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg text-emerald-800 text-center font-black font-jetbrains tracking-widest text-xs">
                    JAM AKTIF: 08.00 – 22.00 WIB
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-brand-dark/80 font-medium text-sm">
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
            <ol className="list-decimal pl-5 space-y-2 text-brand-dark/80 font-medium text-sm">
                <li>Setiap peserta WAJIB menghubungi lawan minimal 2 kali sebelum deadline.</li>
                <li>Respon dianggap SAH apabila dilakukan sebelum pukul 22.00 WIB.</li>
                <li className="text-amber-600 font-bold">Balasan di atas pukul 22.00 WIB tidak dianggap sebagai respon valid.</li>
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
            <div className="space-y-3 text-sm font-medium text-brand-dark/80">
                <p className="font-bold text-brand-dark">Jika lawan tidak merespon (No Respon):</p>
                <ol className="list-decimal pl-5 space-y-2">
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
            <div className="space-y-4 text-sm font-medium text-brand-dark/80">
                <p><strong>Definisi:</strong> Terputusnya koneksi yang menyebabkan laga berhenti.</p>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-amber-900">
                    <strong className="block mb-1">1. DC SEBELUM HALF TIME (0-45 Menit)</strong>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Pertandingan WAJIB diulang dari awal.</li>
                        <li>Skor sebelumnya dianggap tidak berlaku.</li>
                        <li>Pengulangan harus di Matchday yang sama.</li>
                    </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-red-900">
                    <strong className="block mb-1">2. DC SETELAH HALF TIME (45-90 Menit)</strong>
                    Keputusan Admin berdasarkan:<br />
                    - Skor saat DC terjadi.<br />
                    - Kondisi pertandingan & Bukti.<br />
                    <em className="text-xs mt-1 block font-bold">* Admin berhak memutuskan: Lanjut sisa waktu, Ulang, atau Skor Akhir.</em>
                </div>

                <div>
                    <strong className="text-brand-dark block">3. DC Berulang (Akumulatif)</strong>
                    Jika satu tim mengalami DC sebanyak 3 kali dalam satu Matchday, tim tersebut <strong className="text-red-600">DINYATAKAN WO</strong>.
                </div>
                <div>
                    <strong className="text-brand-dark block">4. Bukti Wajib</strong>
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
            <ol className="list-decimal pl-5 space-y-2 text-brand-dark/80 font-medium text-sm">
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
            <div className="space-y-3 text-sm font-medium text-brand-dark/80">
                <p className="text-red-600 font-bold flex items-center gap-2"><ShieldAlert size={16} /> DILARANG KERAS:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Bug abuse</li>
                    <li>Manipulasi jaringan (Lag cheating)</li>
                    <li>Pause spam (mengganggu konsentrasi)</li>
                    <li>Time wasting berlebihan (Backpass berlebihan di area sendiri)</li>
                    <li>Aplikasi pihak ketiga</li>
                </ul>
                <p className="mt-3 bg-red-50 text-red-700 p-2 rounded-lg font-bold">
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
            <ol className="list-decimal pl-5 space-y-2 text-brand-dark/80 font-medium text-sm">
                <li>Protes hanya diterima maksimal 1x24 jam setelah match.</li>
                <li>Protes wajib disertai bukti sah (Video/Screenshot).</li>
                <li className="font-bold text-brand-primary">Keputusan admin bersifat FINAL dan tidak dapat diganggu gugat.</li>
            </ol>
        )
    }
];

export default function RulebookPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState<string[]>(['1']); // Default buka Bab 1

    // ─── LOGIKA PENCARIAN REAL-TIME ───
    const filteredRules = useMemo(() => {
        if (!searchQuery.trim()) return RULES_DATA;
        const query = searchQuery.toLowerCase();
        return RULES_DATA.filter(rule =>
            rule.title.toLowerCase().includes(query) ||
            rule.searchTerms.includes(query)
        );
    }, [searchQuery]);

    // Efek otomatis membuka accordion saat sedang mencari
    useMemo(() => {
        if (searchQuery.trim().length > 0) {
            setOpenItems(filteredRules.map(r => r.id));
        } else if (openItems.length > 1) {
            setOpenItems(['1']); // Reset ke default jika search dikosongkan
        }
    }, [searchQuery, filteredRules]);

    const toggleAccordion = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-brand-bg-light text-brand-dark relative overflow-hidden pb-20 flex flex-col">

            {/* EFEK CAHAYA & BACKGROUND */}
            <div className="fixed top-0 left-0 right-0 h-px bg-gradient-brand z-20 opacity-70" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full opacity-[0.06] pointer-events-none blur-[110px] bg-brand-gold" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #561B1D 0, #561B1D 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

            {/* TOP NAVBAR GLOBAL */}
            <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-light/85 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group focus-visible:outline-none">
                            <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-bronze shadow-sm group-hover:scale-105 transition-transform">
                                <img src="/logos/logo_BELOVESPORT.png" alt="Belovesport" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-sm tracking-widest uppercase text-brand-dark group-hover:text-brand-primary transition-colors">Belovesport</span>
                        </Link>
                        <span className="text-brand-muted/40 text-xs" aria-hidden>/</span>
                        <span className="text-brand-muted text-xs font-medium">Rulebook Resmi</span>
                    </div>
                </div>
            </nav>

            {/* SUB-HEADER HALAMAN */}
            <div className="relative z-20 pt-10 pb-8 px-5">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-gradient-brand shadow-brand mb-5">
                        <BookOpen size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-jetbrains text-brand-dark mb-3">
                        Rules <span className="text-brand-primary">& SOP</span>
                    </h1>
                    <p className="text-brand-muted text-sm font-medium max-w-lg mx-auto">
                        Dokumen resmi aturan dan standar operasional prosedur Turnamen eFootball Belovesport.
                    </p>
                </div>
            </div>

            {/* KONTEN UTAMA */}
            <div className="relative z-10 w-full flex-1 max-w-3xl mx-auto px-4 sm:px-6 w-full">

                {/* KOLOM PENCARIAN */}
                <div className="relative mb-8 shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-brand-gold" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari aturan (Cth: WO, DC, Poin, Jadwal)..."
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-brand-border rounded-xl text-sm font-medium text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                </div>

                {/* DAFTAR ACCORDION */}
                <div className="space-y-3">
                    {filteredRules.length === 0 ? (
                        <div className="text-center py-10 bg-brand-bg-surface border border-dashed border-brand-border rounded-2xl">
                            <p className="text-sm font-bold text-brand-muted">Tidak ada aturan yang cocok dengan pencarian Koko.</p>
                        </div>
                    ) : (
                        filteredRules.map((rule) => {
                            const isOpen = openItems.includes(rule.id);
                            const Icon = rule.icon;

                            return (
                                <div key={rule.id} className="bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm transition-all duration-200">
                                    <button
                                        onClick={() => toggleAccordion(rule.id)}
                                        className={`w-full flex items-center justify-between px-5 py-4 transition-colors focus:outline-none ${isOpen ? 'bg-brand-primary/5 border-b border-brand-border' : 'hover:bg-brand-bg-surface'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className={isOpen ? 'text-brand-primary' : 'text-brand-muted'} />
                                            <span className={`font-black font-jetbrains text-sm sm:text-base tracking-wide ${isOpen ? 'text-brand-primary' : 'text-brand-dark'}`}>
                                                {rule.title}
                                            </span>
                                        </div>
                                        <ChevronDown size={18} className={`text-brand-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-5 bg-white">
                                            {rule.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* FOOTER DISCLAIMER */}
                <div className="mt-12 text-center text-xs font-medium text-brand-muted space-y-2 px-4">
                    <p>Admin berhak menunda, menjadwal ulang, atau menghentikan turnamen apabila terjadi gangguan di luar kendali panitia (Force Majeure).</p>
                    <p className="font-bold text-brand-dark">Dengan mengikuti turnamen ini, peserta dianggap telah menyetujui seluruh aturan dan keputusan panitia tanpa syarat.</p>
                </div>

            </div>
        </div>
    );
}