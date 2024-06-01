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
  HStack,
  Text,
  Checkbox,
} from "@chakra-ui/react"
import PokemonCard from "@/components/PokemonCard"
import PokemonData from "@/components/PokemonData"

export const getStaticProps = async () => {
  const data = await axios.get(
    "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
  )
  const promises = data.data.results.map((result) => axios(result.url))
  const fetched = (await Promise.all(promises)).map((res) => res.data)
  return {
    props: {
      pokemons: fetched,
    },
  }
}

export default function Home({ pokemons: availablePokemos }) {
  const pokemonDataModal = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [pokemon, setPokemon] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState()
  const [currentPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
  )
  const { catchedPokemons } = useCatchedPokemos()

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

  const handleCatchedFilter = () => {
    const catched = pokemon.filter((pokemon) =>
      catchedPokemons.some((catched) => catched.id === pokemon.id)
    )
    setPokemon(catched)
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
        <Container maxW="container.lg">
          <HStack spacing="5" justify="center" p={5}>
            <Text fontSize="2xl">Pokemones</Text>
            <Checkbox onChange={handleCatchedFilter}>
              Capturados ({catchedPokemons.length})
            </Checkbox>
            <Checkbox>
              Por capturar ({pokemon.length - catchedPokemons.length})
            </Checkbox>
          </HStack>
          <Stack p="5" alignItems="center" spacing="5">
            <SimpleGrid spacing="5" columns={{ base: 1, md: 5 }}>
              {/* {pokemon.map((pokemon) => ( */}
              {availablePokemos.map((pokemon) => (
                <Box
                  as="button"
                  key={pokemon.id}
                  onClick={() => handleViewPokemon(pokemon)}
                >
                  <Skeleton isLoaded={!isLoading}>
                    <PokemonCard pokemon={pokemon} />
                  </Skeleton>
                </Box>
              ))}
            </SimpleGrid>

            <Button isLoading={false} onClick={handleNextPage}>
              Cargas más
            </Button>
          </Stack>
        </Container>
      </Flex>
      <Modal {...pokemonDataModal}>
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
