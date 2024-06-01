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
  useColorModeValue,
  Center,
} from "@chakra-ui/react"

export default function PokemonData({
  pokemon: { id, name, weight, height, moves, stats, types },
  pokemon,
}) {
  const toast = useToast()
  const { isCatched, setIsCatched } = useCatchedPokemos(pokemon)
  const bg = useColorModeValue("gray.100", "gray.900")

  const handleChange = (e) => {
    if (!isCatched) {
      // POST /api/catched
      const newPokemon = {
        id,
        name,
      }
      axios.post(`/api/catched`, newPokemon).then((res) => {
        setIsCatched(true)
        toast({
          title: "Pokemon capturado",
          description: `${name} ha sido capturado con éxito`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      })
    } else {
      // DELETE /api/catched/{pokemonId}
      axios.delete(`/api/catched/${id}`).then((res) => {
        setIsCatched(false)
        toast({
          title: res.data,
          description: `${name} ha sido liberado con éxito`,
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
        <Center>
          <AspectRatio w={{ base: "75%", xl: "full" }} ratio={1} a>
            <Image
              objectFit="contain"
              alt={`${name} image`}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`}
            />
          </AspectRatio>
        </Center>
        <Stack direction="row" spacing="5" justifyContent="space-between">
          <Stack>
            <Text fontSize="sm">Weight</Text>
            <Text>{weight}</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Height</Text>
            <Text>{height}</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Movimientos</Text>
            <Text>{moves.length}</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Tipos</Text>
            <HStack>
              {types.map((type) => {
                return (
                  <Badge size="xs" key={type.slot}>
                    {type.type.name}
                  </Badge>
                )
              })}
            </HStack>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing="5" p="5" bg={bg} borderRadius="xl">
        {stats.map((stat) => {
          return (
            <Stack key={stat.stat.name}>
              <Text fontSize="xs" textTransform="capitalize">
                {stat.stat.name}
              </Text>
              <Progress
                bg="gray.300"
                borderRadius="full"
                value={stat.base_stat}
              />
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}
