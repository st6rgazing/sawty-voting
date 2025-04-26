import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent dark:from-black/10"></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full">
              <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-800 dark:text-purple-200">
                Quantum-Secured Voting
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Welcome to Sawty
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12">
              Your secure, quantum-powered e-voting platform that ensures tamper-proof elections with cutting-edge
              technology
            </p>

            <Link href="/technology">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
