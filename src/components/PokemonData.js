import { useEffect, useState } from "react"
import axios from "axios"
import { useCatchedPokemos } from "@/customHooks/useCatchedPokemos"
import {
  Box,
  AspectRatio,
  Image,
  Stack,
  Progress,
  Text,
  Badge,
  HStack,
  Checkbox,
  useToast,
} from "@chakra-ui/react"

// export const getServerSideProps = async ({ params }) => {
//   const { id } = params;
//   const { data } = await handler({ method: "GET"});
//   return {
//     props: {
//       catcheds: data,
//     },
//   };
// }

export default function PokemonData({ pokemon }) {
  const toast = useToast()
  const { isCatched, setIsCatched, catchedPokemons, isLoading } =
    useCatchedPokemos(pokemon)

  const handleChange = (e) => {
    if (!isCatched) {
      // POST /api/catched
      const newPokemon = {
        id: pokemon.id,
        name: pokemon.name,
      }
      axios.post(`/api/catched`, newPokemon).then((res) => {
        setIsCatched(true)
        toast({
          title: "Pokemon capturado",
          description: `${pokemon.name} ha sido capturado con éxito`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      })
    } else {
      // DELETE /api/catched/{pokemonId}
      axios.delete(`/api/catched/${pokemon.id}`).then((res) => {
        setIsCatched(false)
        toast({
          title: res.data,
          description: `${pokemon.name} ha sido liberado con éxito`,
          status: "info",
          duration: 3000,
          isClosable: true,
        })
      })
    }
  }

  return (
    <Stack spacing="5" pb="5">
      <Stack spacing="5" position="relative">
        <Box position="absolute" right="0" zIndex="99">
          <Checkbox onChange={handleChange} isChecked={isCatched}>
            Catched
          </Checkbox>
        </Box>
        <AspectRatio w="full" ratio={1}>
          <Image
            objectFit="contain"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`}
          />
        </AspectRatio>
        <Stack direction="row" spacing="5">
          <Stack>
            <Text fontSize="sm">Weight</Text>
            <Text>20</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Height</Text>
            <Text>12</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Movimientos</Text>
            <Text>109</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Tipos</Text>
            <HStack>
              <Badge>Agua</Badge>
              <Badge>Agua</Badge>
            </HStack>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing="5" p="5" bg="gray.100" borderRadius="xl">
        <Stack>
          <Text fontSize="xs">hp</Text>
          <Progress bg="gray.300" borderRadius="full" value={80} />
        </Stack>
        <Stack>
          <Text fontSize="xs">attack</Text>
          <Progress bg="gray.300" borderRadius="full" value={65} />
        </Stack>
      </Stack>
    </Stack>
  )
}
