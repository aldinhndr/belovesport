// Path: src/app/rulebook/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, BookOpen, Search, ChevronDown, Gavel,
    Network, Clock, MessageSquare, Ban, WifiOff,
    Edit3, AlertTriangle, Megaphone, ShieldAlert, Trophy,
    Gamepad2, ShieldX, Users, Camera
} from 'lucide-react';

const RULES_DATA = [
    {
        id: '1',
        title: 'I. KETENTUAN UMUM',
        icon: Gavel,
        searchTerms: 'ketentuan umum akun joki 1 user 2 team nama logo diskualifikasi',
        content: (
            <ol className="list-decimal pl-5 space-y-3 font-medium text-sm leading-relaxed" style={{ color: '#27272a' }}>
                <li>Turnamen menggunakan game eFootball versi terbaru (update resmi Konami).</li>
                <li>Setiap peserta wajib menggunakan akun pribadi.</li>
                <li>Satu akun diperbolehkan mewakili maksimal dua tim (1 User = 2 Team).</li>
                <li className="font-bold p-3 rounded-xl" style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
                    ⚠️ Dilarang keras menggunakan akun joki atau bermain untuk lebih dari 2 tim.
                </li>
                <li>Nama tim dan logo yang digunakan WAJIB sesuai saat pendaftaran dan tidak boleh diubah.</li>
                <li>Pelanggaran terhadap ketentuan umum dapat berujung pada sanksi hingga diskualifikasi.</li>
            </ol>
        )
    },
    {
        id: '2',
        title: 'II. PENGATURAN KAMAR PERTANDINGAN (MATCH ROOM) & SKUAD',
        icon: Gamepad2,
        searchTerms: 'match room room kamar 10 menit kondisi normal cedera perpanjangan waktu extra time penalti pergantian subs dream team kekuatan',
        content: (
            <div className="space-y-6">
                {/* HIGHLIGHT CARDS - CLEAN INLINE STYLE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl flex flex-col justify-between" style={{ backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7' }}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#b45309' }}>Durasi Laga</span>
                            <Clock size={14} style={{ color: '#b45309' }} />
                        </div>
                        <p className="text-xs font-extrabold" style={{ color: '#18181b' }}>Fiks 10 Menit</p>
                    </div>

                    <div className="p-3.5 rounded-xl flex flex-col justify-between" style={{ backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7' }}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#b45309' }}>Jenis Skuad</span>
                            <Users size={14} style={{ color: '#b45309' }} />
                        </div>
                        <p className="text-xs font-extrabold" style={{ color: '#18181b' }}>Dream Team (Bebas)</p>
                    </div>

                    <div className="p-3.5 rounded-xl flex flex-col justify-between" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#e11d48' }}>Fitur Bantuan</span>
                            <ShieldX size={14} style={{ color: '#e11d48' }} />
                        </div>
                        <p className="text-xs font-black" style={{ color: '#e11d48' }}>Smart Assist WAJIB OFF</p>
                    </div>
                </div>

                {/* DETIL Rincian Room */}
                <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#27272a' }}>
                    <p className="font-extrabold uppercase text-xs tracking-wider" style={{ color: '#09090b' }}>1. Pengaturan Kamar Pertandingan (Match Room):</p>
                    <ul className="list-disc pl-5 space-y-2 font-medium">
                        <li><strong>Waktu Pertandingan:</strong> Fiks 10 menit.</li>
                        <li><strong>Kondisi Pemain (Condition):</strong> Disetel ke <strong>Normal (Panah Kuning/Kanan)</strong> agar performa pemain stabil dan adil untuk kedua tim.</li>
                        <li><strong>Cidera (Injuries):</strong> Aktif (On).</li>
                        <li>
                            <strong>Perpanjangan Waktu (Extra Time) &amp; Penalti (PK):</strong>
                            <ul className="list-circle pl-5 mt-1 space-y-1 text-xs">
                                <li>• <u>Fase Grup / Babak Knock Out Leg 1:</u> Disetel <strong>Mati (Off)</strong>. Laga bisa berakhir seri.</li>
                                <li>• <u>Babak Knock Out Leg 2:</u> Disetel <strong>Aktif (On)</strong> untuk menentukan pemenang jika agregat skor masih imbang.</li>
                            </ul>
                        </li>
                        <li><strong>Pergantian Pemain:</strong> Maksimal 6 Pemain (Subs) dengan kesempatan jeda maksimal 6 Interval.</li>
                    </ul>

                    <p className="font-extrabold uppercase text-xs tracking-wider mt-4" style={{ color: '#09090b' }}>2. Ketentuan Skuad:</p>
                    <ul className="list-disc pl-5 space-y-2 font-medium">
                        <li><strong>Jenis Skuad:</strong> Menggunakan Dream Team.</li>
                        <li><strong>Batasan Kekuatan:</strong> <u>BEBAS (Tidak Ada Batasan)</u>. Peserta bebas menggunakan kombinasi kartu pemain terbaik mereka.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: '3',
        title: 'III. ATURAN LARANGAN & GAMEPLAY',
        icon: AlertTriangle,
        searchTerms: 'larangan gameplay backpass bug glitch cheat network tampering',
        content: (
            <div className="space-y-4 text-sm font-medium leading-relaxed" style={{ color: '#27272a' }}>
                <p className="p-3 rounded-xl text-xs font-bold" style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
                    ⚠️ Pemain yang melanggar poin di bawah ini dapat dikenakan sanksi pengurangan poin atau diskualifikasi langsung oleh panitia:
                </p>

                <div className="space-y-3">
                    <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7' }}>
                        <strong className="block text-xs uppercase tracking-wide font-extrabold mb-1" style={{ color: '#e11d48' }}>1. Dilarang Backpass Berlebihan</strong>
                        <p className="text-xs">
                            Operan di area pertahanan sendiri secara terus-menerus antara bek dan kiper demi mengulur waktu (saat posisi unggul) dilarang keras. Batas maksimal operan beruntun di area pertahanan sendiri adalah <strong>3–5 kali</strong>, setelah itu bola harus dialirkan ke depan atau dibuang.
                        </p>
                    </div>

                    <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7' }}>
                        <strong className="block text-xs uppercase tracking-wide font-extrabold mb-1" style={{ color: '#e11d48' }}>2. Dilarang Eksploitasi Bug / Glitch</strong>
                        <p className="text-xs">
                            Tidak diperbolehkan memanfaatkan cacat sistem atau glitch game yang tidak wajar (kecuali trik/mekanik permainan yang memang Anda pelajari sebagai bagian dari penguasaan keahlian atau skill individu).
                        </p>
                    </div>

                    <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7' }}>
                        <strong className="block text-xs uppercase tracking-wide font-extrabold mb-1" style={{ color: '#e11d48' }}>3. Dilarang Cheat &amp; Network Tampering</strong>
                        <p className="text-xs">
                            Penggunaan aplikasi pihak ketiga, modifikasi grafik/data, atau sengaja membuat jaringan tidak stabil (lagging) akan langsung didiskualifikasi jika terbukti.
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: '4',
        title: 'IV. SISTEM PELAPORAN HASIL LAGA',
        icon: Camera,
        searchTerms: 'sistem pelaporan hasil bukti skor screenshot bukti pelanggaran video screen record',
        content: (
            <div className="space-y-3 text-sm font-medium leading-relaxed" style={{ color: '#27272a' }}>
                <ol className="list-decimal pl-5 space-y-3">
                    <li>
                        <strong>Bukti Skor Resmi:</strong> Pemenang wajib mengirimkan screenshot halaman statistik akhir yang menampilkan skor mutlak dan nama/ID kedua pemain.
                    </li>
                    <li className="p-3 rounded-xl" style={{ backgroundColor: '#fefce8', color: '#a16207', border: '1px solid #fef08a' }}>
                        <strong>Bukti Pelanggaran:</strong> Jika lawan terbukti melakukan backpass ilegal atau memanfaatkan bug/glitch, korban <u>WAJIB menyertakan bukti rekaman video (screen record)</u> saat melapor ke panitia agar laporan bisa diproses sah.
                    </li>
                </ol>
            </div>
        )
    },
    {
        id: '5',
        title: 'V. WAKTU & DEADLINE',
        icon: Clock,
        searchTerms: 'waktu deadline jam aktif kick off terlambat wo',
        content: (
            <div className="space-y-4">
                <div className="p-3 rounded-xl text-center font-black font-mono tracking-widest text-xs" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                    🕒 JAM AKTIF UTAMA: 08.00 – 22.00 WIB
                </div>
                <ol className="list-decimal pl-5 space-y-2.5 font-medium text-sm leading-relaxed" style={{ color: '#27272a' }}>
                    <li>Kick Off Matchday dimulai pukul <strong>07.00 WIB</strong>.</li>
                    <li>Deadline Matchday berakhir pukul <strong>23.59 WIB</strong>.</li>
                    <li>Segala bentuk komunikasi, konfirmasi, dan pertandingan dianjurkan dilakukan pada jam aktif.</li>
                    <li>Keterlambatan lebih dari 2 jam dari deadline dapat berujung pada sanksi WO.</li>
                </ol>
            </div>
        )
    },
    {
        id: '6',
        title: 'VI. KOMUNIKASI & RESPON',
        icon: MessageSquare,
        searchTerms: 'komunikasi respon hubungi lawan sah batas jam',
        content: (
            <ol className="list-decimal pl-5 space-y-2.5 font-medium text-sm leading-relaxed" style={{ color: '#27272a' }}>
                <li>Setiap peserta WAJIB menghubungi lawan minimal 2 kali sebelum deadline.</li>
                <li>Respon dianggap SAH apabila dilakukan sebelum pukul 22.00 WIB.</li>
                <li className="font-bold p-2.5 rounded-xl" style={{ backgroundColor: '#fefce8', color: '#a16207', border: '1px solid #fef08a' }}>
                    ⚠️ Balasan di atas pukul 22.00 WIB tidak dianggap sebagai respon valid.
                </li>
                <li>Balasan setelah deadline Matchday (23.59 WIB) dianggap tidak sah.</li>
                <li>Alasan pribadi seperti tidur, offline, atau kesibukan tidak dapat dijadikan pembelaan (kecuali sudah ada konfirmasi resmi kepada Admin).</li>
            </ol>
        )
    },
    {
        id: '7',
        title: 'VII. SOP WALK OVER (WO)',
        icon: Ban,
        searchTerms: 'walk over wo no respon bukti ss 3-0',
        content: (
            <div className="space-y-3 text-sm font-medium leading-relaxed" style={{ color: '#27272a' }}>
                <p className="font-bold" style={{ color: '#09090b' }}>Jika lawan tidak merespon (No Respon):</p>
                <ol className="list-decimal pl-5 space-y-2.5">
                    <li>Peserta wajib mengirim pesan konfirmasi formal kepada lawan (Sertakan Matchday &amp; Deadline).</li>
                    <li>Screenshot chat wajib memperlihatkan waktu dan status pesan yang tidak dibalas.</li>
                    <li>Bukti dikirimkan ke admin sebelum waktu deadline berakhir.</li>
                    <li>Jika lawan tidak merespon hingga deadline, admin berhak menetapkan keputusan WO.</li>
                    <li className="font-bold p-2 rounded-lg" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                        Skor Kemenangan WO ditetapkan: 3 – 0.
                    </li>
                    <li>Jika kedua tim sama-sama tidak melakukan komunikasi, kedua tim dianggap WO (0 poin).</li>
                </ol>
            </div>
        )
    },
    {
        id: '8',
        title: 'VIII. ATURAN DISCONNECT (DC)',
        icon: WifiOff,
        searchTerms: 'disconnect dc putus koneksi half time ulang bukti',
        content: (
            <div className="space-y-4 text-sm font-medium leading-relaxed" style={{ color: '#27272a' }}>
                <p><strong>Definisi:</strong> Terputusnya koneksi internet/jaringan yang menyebabkan laga berhenti mendadak.</p>

                <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a', color: '#854d0e' }}>
                    <strong className="block mb-1 text-xs uppercase tracking-wider font-extrabold" style={{ color: '#a16207' }}>1. DC SEBELUM HALF TIME (0-45 Menit)</strong>
                    <ul className="list-disc pl-4 space-y-1 text-xs font-semibold">
                        <li>Pertandingan WAJIB diulang penuh dari awal.</li>
                        <li>Skor sebelum terjadinya DC dianggap tidak berlaku.</li>
                        <li>Pengulangan laga harus dilakukan di Matchday yang sama.</li>
                    </ul>
                </div>

                <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#9f1239' }}>
                    <strong className="block mb-1 text-xs uppercase tracking-wider font-extrabold" style={{ color: '#e11d48' }}>2. DC SETELAH HALF TIME (45-90 Menit)</strong>
                    <p className="text-xs font-semibold">Keputusan penuh ada di tangan Admin berdasarkan:</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                        <li>Skor terakhir saat DC terjadi.</li>
                        <li>Kondisi jalannya laga &amp; bukti terlampir.</li>
                    </ul>
                    <em className="text-[11px] mt-1.5 block font-bold" style={{ color: '#71717a' }}>* Admin berhak memutuskan: Lanjut sisa waktu, Ulang laga, atau Menetapkan Skor Akhir.</em>
                </div>

                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7' }}>
                    <strong className="block text-xs uppercase tracking-wider mb-1 font-bold" style={{ color: '#09090b' }}>3. DC Berulang (Akumulatif)</strong>
                    Jika satu tim mengalami DC sebanyak 3 kali dalam satu Matchday, tim tersebut <strong style={{ color: '#e11d48' }}>LANGSUNG DINYATAKAN WO</strong>.
                </div>
            </div>
        )
    },
    {
        id: '9',
        title: 'IX. PROTES & SENGKETA',
        icon: Megaphone,
        searchTerms: 'protes sengketa bukti video final mutlak',
        content: (
            <ol className="list-decimal pl-5 space-y-2.5 font-medium text-sm leading-relaxed" style={{ color: '#27272a' }}>
                <li>Protes hanya diterima maksimal 1x24 jam setelah pertandingan selesai.</li>
                <li>Protes wajib disertai bukti sah dan jelas (Video rekaman / Screenshot).</li>
                <li className="font-extrabold p-2.5 rounded-xl" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                    ⚖️ Keputusan Admin bersifat FINAL, MUTLAK, dan tidak dapat diganggu gugat.
                </li>
            </ol>
        )
    }
];

export default function RulebookPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState<string[]>(['1', '2']);

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
        } else if (openItems.length > 2) {
            setOpenItems(['1', '2']);
        }
    }, [searchQuery, filteredRules]);

    const toggleAccordion = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen pb-24 flex flex-col antialiased" style={{ backgroundColor: '#ffffff', color: '#09090b' }}>

            {/* ── HEADER NAVIGATION ── */}
            <div className="border-b sticky top-0 z-20" style={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7' }}>
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link
                        href="/profil"
                        className="p-2 rounded-xl transition-all"
                        style={{ backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7' }}
                    >
                        <ArrowLeft size={18} style={{ color: '#52525b' }} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={20} style={{ color: '#b45309' }} />
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight font-mono" style={{ color: '#09090b' }}>
                                Rules <span style={{ color: '#b45309' }}>&amp; SOP</span>
                            </h1>
                        </div>
                        <p className="text-xs mt-0.5 flex items-center gap-1.5 font-semibold" style={{ color: '#71717a' }}>
                            <Trophy size={13} style={{ color: '#d97706' }} />
                            Regulasi Resmi Turnamen BELOVESPORT
                        </p>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ARENA ── */}
            <div className="w-full max-w-3xl mx-auto px-4 mt-6 flex-1 flex flex-col">

                {/* SEARCH INPUT */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search size={16} style={{ color: '#a1a1aa' }} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari aturan spesifik (Cth: Match Room, Backpass, Smart Assist)..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold transition-all shadow-sm"
                        style={{ backgroundColor: '#fafafa', border: '1px solid #d4d4d8', color: '#09090b' }}
                    />
                </div>

                {/* ACCORDION LIST */}
                <div className="space-y-4">
                    {filteredRules.length === 0 ? (
                        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#fafafa', border: '1px border-dashed #e4e4e7' }}>
                            <p className="text-xs font-bold" style={{ color: '#71717a' }}>Tidak ada poin regulasi yang cocok dengan kata kunci pencarian.</p>
                        </div>
                    ) : (
                        filteredRules.map((rule) => {
                            const isOpen = openItems.includes(rule.id);
                            const Icon = rule.icon;

                            return (
                                <div
                                    key={rule.id}
                                    className="rounded-2xl overflow-hidden shadow-sm transition-all"
                                    style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7' }}
                                >
                                    <button
                                        onClick={() => toggleAccordion(rule.id)}
                                        className="w-full flex items-center justify-between px-5 py-4 transition-colors focus:outline-none"
                                        style={{ backgroundColor: isOpen ? '#fafafa' : '#ffffff' }}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-2 rounded-xl" style={{ backgroundColor: isOpen ? '#fef3c7' : '#f4f4f5', color: isOpen ? '#b45309' : '#71717a' }}>
                                                <Icon size={18} />
                                            </div>
                                            <span className="font-black font-mono text-xs sm:text-sm tracking-wide" style={{ color: isOpen ? '#b45309' : '#18181b' }}>
                                                {rule.title}
                                            </span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ color: isOpen ? '#b45309' : '#a1a1aa' }} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1600px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        <div className="p-5 sm:p-6 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#f4f4f5' }}>
                                            {rule.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* FOOTER DISCLAIMER */}
                <div className="mt-12 text-center text-[11px] font-semibold space-y-2 px-4 leading-relaxed" style={{ color: '#71717a' }}>
                    <p>Admin berhak menunda, menjadwal ulang, atau menghentikan turnamen apabila terjadi gangguan di luar kendali panitia (Force Majeure).</p>
                    <p className="font-extrabold" style={{ color: '#18181b' }}>Dengan mengikuti turnamen ini, peserta dianggap telah menyetujui seluruh aturan dan keputusan panitia tanpa syarat.</p>
                </div>

            </div>
        </div>
    );
}