import { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "@/util/constants"

export const useCatchedPokemos = (pokemon) => {
  const [isCatched, setIsCatched] = useState(false)
  const [catchedPokemons, setCatchedPokemons] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPokemons = () => {
    axios.get(`${BASE_URL}/api/catched`).then((res) => {
      const isCatched = pokemon
        ? res.data.some((pokemons) => pokemons.id === Number(pokemon.id))
        : false
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
    setCatchedPokemons,
    isLoading,
    error,
  }
}
