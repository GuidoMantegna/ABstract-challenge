import { useState, useEffect } from "react"
import axios from "axios"

export const useCatchedPokemos = (pokemon) => {
  const [isCatched, setIsCatched] = useState(false)
  const [catchedPokemons, setCatchedPokemons] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPokemons = () => {
    axios.get(`/api/catched`).then((res) => {
      const isCatched = res.data.some(
        (pokemons) => pokemons.id === Number(pokemon.id)
      )
      setIsCatched(isCatched)
      setCatchedPokemons(res.data)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    getPokemons()
  }, [])

  return {
    isCatched,
    setIsCatched,
    catchedPokemons,
    isLoading,
    error,
  }
}
