"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { submitVote } from "@/lib/api"

interface CandidateDetails {
  id: string
  name: string
  position: string
  party: string
  image: string
  bio: string
  policies: string[]
  experience: { title: string; organization: string; period: string }[]
}

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // This is just a mock implementation
    const mockCandidates: Record<string, CandidateDetails> = {
      "cand-jane-92a7": {
        id: "cand-jane-92a7",
        name: "Jane Doe",
        position: "Presidential Candidate",
        party: "Progressive Future Party",
        image: "/placeholder.svg?height=400&width=400",
        bio: "Jane Doe has dedicated her life to public service, advocating for education reform and healthcare accessibility. With over 20 years in the Senate, she has authored numerous bills aimed at improving social welfare and economic growth.",
        policies: [
          "Universal Healthcare Implementation",
          "Renewable Energy Investment",
          "Education System Overhaul",
          "Criminal Justice Reform",
        ],
        experience: [
          { title: "Senator", organization: "State of Example", period: "2005–Present" },
          { title: "Chair", organization: "Education Committee", period: "2010–2015" },
          { title: "Board Member", organization: "National Health Association", period: "2016–2020" },
        ],
      },
      "cand-john-5b2f": {
        id: "cand-john-5b2f",
        name: "John Smith",
        position: "Presidential Candidate",
        party: "National Unity Alliance",
        image: "/placeholder.svg?height=400&width=400",
        bio: "John Smith is a former governor with extensive experience in economic policy and international relations. His leadership during the economic crisis of 2018 earned him national recognition for innovative fiscal strategies.",
        policies: [
          "Tax Reform Initiative",
          "Infrastructure Development",
          "Small Business Support",
          "National Security Enhancement",
        ],
        experience: [
          { title: "Governor", organization: "State of Sample", period: "2015–2023" },
          { title: "Mayor", organization: "Capital City", period: "2010–2015" },
          { title: "Economic Advisor", organization: "Federal Reserve", period: "2005–2010" },
        ],
      },
      "cand-emily-7d8c": {
        id: "cand-emily-7d8c",
        name: "Emily Brown",
        position: "Presidential Candidate",
        party: "Citizens Reform Movement",
        image: "/placeholder.svg?height=400&width=400",
        bio: "Emily Brown brings a fresh perspective to politics with her background in environmental science and community organizing. She has led successful grassroots campaigns for climate action and social justice.",
        policies: [
          "Climate Change Action Plan",
          "Wealth Inequality Reduction",
          "Public Transportation Expansion",
          "Healthcare Accessibility",
        ],
        experience: [
          { title: "Executive Director", organization: "Climate Action Now", period: "2018–Present" },
          { title: "City Council Member", organization: "Metro City", period: "2014–2018" },
          { title: "Research Scientist", organization: "National Environmental Institute", period: "2010–2014" },
        ],
      },
    }

    setCandidate(mockCandidates[params.id] || null)
  }, [params.id])

  const confirmVote = async () => {
    setLoading(true)

    try {
      const secretId = localStorage.getItem("secretId")

      if (!secretId) {
        toast({
          title: "Error",
          description: "No Secret ID found. Please log in again.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const { success, data } = await submitVote(secretId, params.id)

      if (success) {
        toast({
          title: "Vote Submitted Successfully",
          description: "Your vote has been securely recorded using Quantum Key Distribution.",
          duration: 5000,
        })
        router.push("/thank-you")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit vote. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <p>Candidate not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <Link href="/candidates" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Candidates
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="md:flex">
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <Image src={candidate.image || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
              </div>
              <div className="md:w-2/3 p-6 md:p-8">
                <Badge className="mb-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                  {candidate.party}
                </Badge>
                <h1 className="text-3xl font-bold mb-1">{candidate.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{candidate.position}</p>

                <div className="space-y-6">
                  <section>
                    <h2 className="text-xl font-semibold mb-2">Biography</h2>
                    <p className="text-slate-600 dark:text-slate-300">{candidate.bio}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-2">Key Policies</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {candidate.policies.map((policy, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-300">{policy}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-2">Experience</h2>
                    <ul className="space-y-2">
                      {candidate.experience.map((exp, index) => (
                        <li key={index} className="text-slate-600 dark:text-slate-300">
                          <span className="font-medium">{exp.title}</span> – {exp.organization} ({exp.period})
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="pt-4">
                    <Button
                      onClick={confirmVote}
                      disabled={loading}
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? "Processing..." : "Vote Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
