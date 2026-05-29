import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import type { Hakuna } from '../database.types'

interface AuthState {
  session: Session | null
  hakuna: Hakuna | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  session: null,
  hakuna: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [hakuna, setHakuna] = useState<Hakuna | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const email = session?.user?.email
    if (!email) {
      setHakuna(null)
      return
    }
    // Match the authenticated user to a staff record by email.
    supabase
      .from('hakunas')
      .select('*')
      .eq('email', email)
      .maybeSingle()
      .then(({ data }) => setHakuna(data))
  }, [session])

  const signOut = async () => {
    await supabase.auth.signOut()
    setHakuna(null)
  }

  return (
    <AuthContext.Provider value={{ session, hakuna, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
