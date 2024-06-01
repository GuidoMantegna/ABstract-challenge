import { useEffect, useMemo, useState } from "react"
import Head from "next/head"
import { Inter, Island_Moments } from "next/font/google"
import axios from "axios"
const inter = Inter({ subsets: ["latin"] })
import { useCatchedPokemos } from "@/customHooks/useCatchedPokemos"
import {
  Container,
  Stack,
  Button,
  SimpleGrid,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react"
import PokemonCard from "@/components/PokemonCard"
import PokemonData from "@/components/PokemonData"
import { Filters } from "@/components/Filters"
import ThemeToggler from "@/components/ThemeToggle"

export const getServerSideProps = async () => {
  const data = await axios.get(
    "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
  )
  const promises = data.data.results.map((result) => axios(result.url))
  const pokemons = (await Promise.all(promises)).map((res) => res.data)
  return {
    props: {
      pokemons,
    },
  }
}

export default function Home({ pokemons }) {
  const pokemonDataModal = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [pokemon, setPokemon] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState()
  const [currentPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
  )
  const { catchedPokemons } = useCatchedPokemos()
  const [filter, setFilter] = useState("all")
  const availablePokemos = useMemo(() => {
    let filteredPokemons = pokemon
    if (filter === "catched") {
      filteredPokemons = pokemon.filter((pokemon) =>
        catchedPokemons.some((p) => p.id === pokemon.id)
      )
    }
    if (filter === "free") {
      filteredPokemons = pokemon.filter(
        (pokemon) => !catchedPokemons.some((p) => p.id === pokemon.id)
      )
    }
    return filteredPokemons
  }, [pokemon, filter])

  const getPokemons = () => {
    axios.get(currentPage).then(async ({ data }) => {
      const promises = data.results.map((result) => axios(result.url))
      const fetchedPokemon = (await Promise.all(promises)).map(
        (res) => res.data
      )
      setPokemon((prev) => [...prev, ...fetchedPokemon])
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    getPokemons()
  }, [currentPage])

  function handleNextPage() {
    const next = pokemon[pokemon.length - 1].id + 1
    setCurrentPage(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${next}`)
  }

  function handleViewPokemon(pokemon) {
    setSelectedPokemon(pokemon)
    pokemonDataModal.onOpen()
  }

  const handleFilter = (e) => {
    setFilter(e.target.name)
  }

  return (
    <>
      <Head>
        <title>Pokemon Challenge</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex alignItems="center" minH="100vh" justifyContent="center">
        <ThemeToggler />
        <Container maxW="container.lg" mt={24}>
          <Filters
            filter={filter}
            handleFilter={handleFilter}
            pokemon={pokemon}
            catchedPokemons={catchedPokemons}
          />
          <Stack p="5" alignItems="center" spacing="5">
            <SimpleGrid spacing="5" columns={{ base: 1, md: 5 }}>
              {availablePokemos.map((pokemon) => (
                <Box
                  as="button"
                  key={pokemon.id}
                  onClick={() => handleViewPokemon(pokemon)}
                  _hover={{ transform: "scale(1.1)" }}
                  transition="transform 0.3s"
                >
                  <Skeleton isLoaded={!isLoading}>
                    <PokemonCard pokemon={pokemon} />
                  </Skeleton>
                </Box>
              ))}
            </SimpleGrid>

            <Button
              isLoading={isLoading}
              onClick={handleNextPage}
              variant="outline"
              colorScheme="teal"
            >
              Cargas más
            </Button>
          </Stack>
        </Container>
      </Flex>
      <Modal {...pokemonDataModal} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform="capitalize">
            {selectedPokemon?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPokemon && <PokemonData pokemon={selectedPokemon} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
