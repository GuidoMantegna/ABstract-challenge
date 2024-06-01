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
} from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"

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
  const [catched, setCatched] = useState(false)

  useEffect(() => {
    // GET /api/catched?pokemonId=1
    // axios.get(`/api/catched`).then((res) => {
    axios.get(`/api/catched?pokemonId=${pokemon.id}`).then((res) => {
      const isCatched = res.data.some(
        (pokemons) => pokemons.id === Number(pokemon.id)
      )
      setCatched(isCatched)
    })
  }, [])

  const handleChange = (e) => {
    if (!catched) {
      // POST /api/catched
      axios.post(`/api/catched`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pokemon),
      }).then((res) => {
        setCatched(true)
      })
    } else {
      // DELETE /api/catched
      axios.delete(`/api/catched/${pokemon.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pokemon),
      }).then((res) => {
        setCatched(false)
      })
    }
  }

  return (
    <Stack spacing="5" pb="5">
      <Stack spacing="5" position="relative">
        <Box position="absolute" right="0" zIndex="99">
          <Checkbox onChange={handleChange} isChecked={catched}>Catched</Checkbox>
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
