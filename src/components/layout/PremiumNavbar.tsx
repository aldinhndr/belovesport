"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { NAV_ITEMS } from "@/lib/constants"

export function PremiumNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const goToSignup = () => {
    setMobileMenuOpen(false)
    router.push("/signup")
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tighter uppercase">
              BELOVE<span className="text-[#FF2E8A]">s</span>PORT
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {NAV_ITEMS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hidden lg:flex" onClick={() => {
                const el = document.getElementById("faq")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}>Buku Panduan</Button>
              <Button variant="premium" onClick={goToSignup}>Daftar Sekarang</Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {NAV_ITEMS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xl font-bold text-white w-full py-4 border-b border-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="w-full pt-6 flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={() => {
                  setMobileMenuOpen(false)
                  const el = document.getElementById("faq")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}>Buku Panduan</Button>
                <Button variant="premium" className="w-full" onClick={goToSignup}>Daftar Sekarang</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}