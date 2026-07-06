
export function EventSchedule() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Jadwal Event Belove Sport</h2>
                        <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Jangan lewatkan momen seru! Catat tanggal-tanggal penting turnamen kami.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold">Pendaftaran Dibuka</h3>
                        <p className="text-sm text-gray-500">1 Juli 2024 - 31 Juli 2024</p>
                        <p className="text-sm text-gray-400">Siapkan tim Anda dan daftar sekarang!</p>
                    </div>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold">Penyisihan Grup</h3>
                        <p className="text-sm text-gray-500">10 Agustus 2024 - 20 Agustus 2024</p>
                        <p className="text-sm text-gray-400">Saksikan tim-tim terbaik bertanding di babak penyisihan.</p>
                    </div>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold">Babak Gugur</h3>
                        <p className="text-sm text-gray-500">25 Agustus 2024 - 30 Agustus 2024</p>
                        <p className="text-sm text-gray-400">Pertarungan sengit menuju puncak!</p>
                    </div>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold">Grand Final</h3>
                        <p className="text-sm text-gray-500">5 September 2024</p>
                        <p className="text-sm text-gray-400">Siapa yang akan menjadi juara Belove Sport?</p>
                    </div>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold">Pengumuman Pemenang</h3>
                        <p className="text-sm text-gray-500">6 September 2024</p>
                        <p className="text-sm text-gray-400">Lihat siapa yang berhasil meraih kejayaan!</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
