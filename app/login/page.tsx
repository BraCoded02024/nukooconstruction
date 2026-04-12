"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(formData)
      localStorage.setItem('token', response.data.token)
      router.push('/admin')
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-background min-h-screen pt-24">
      <Navigation />
      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif text-foreground mb-8">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 border border-border">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            <label className="text-sm font-sans uppercase tracking-wider text-foreground">Email</label>
            <input
              required
              type="email"
              className="w-full bg-background border border-border p-3 focus:border-primary outline-none transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans uppercase tracking-wider text-foreground">Password</label>
            <input
              required
              type="password"
              className="w-full bg-background border border-border p-3 focus:border-primary outline-none transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  )
}
