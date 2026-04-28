import { useState, useEffect } from 'react'

interface ApiOptions<T> {
  initialData?: T
  dependencies?: any[]
}

interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  url: string,
  options: ApiOptions<T> = {}
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(options.initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      setData(result)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  }, options.dependencies || [url])

  const refetch = () => fetchData()
  return { data, loading, error, refetch }
}

export function useApiPost<T>(
  url: string,
  body: Record<string, any>
): Promise<T> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })
}
