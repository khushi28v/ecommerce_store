import { useCallback, useState } from "react"
import { getToken, parseJwt } from "./auth"

export function getUserId(): number | null {
  const token = getToken()
  return token ? parseJwt(token)?.user_id ?? null : null
}

export function getFavoritesKey(userId: number | null): string {
  return `favorites_${userId || "guest"}`
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return []
    const id = getUserId()
    const key = getFavoritesKey(id)
    const stored = localStorage.getItem(key) || localStorage.getItem("favorites")
    if (!stored) return []
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[]
        localStorage.setItem(key, JSON.stringify(parsed))
        return parsed
      } catch {
        return []
      }
    }
    return []
  })

  const addFavorite = useCallback((id: number) => {
    const key = getFavoritesKey(getUserId())
    setFavorites((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id].sort((a, b) => a - b)
      localStorage.setItem(key, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((id: number) => {
    const key = getFavoritesKey(getUserId())
    setFavorites((prev) => {
      const updated = prev.filter((x) => x !== id)
      localStorage.setItem(key, JSON.stringify(updated))
      return updated
    })
  }, [])

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback(
    (id: number) => (favorites.includes(id) ? removeFavorite(id) : addFavorite(id)),
    [favorites, addFavorite, removeFavorite]
  )


  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  }
}
