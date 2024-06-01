import { HStack, Checkbox, useColorModeValue } from "@chakra-ui/react"

export const Filters = ({ filter, handleFilter, pokemon, catchedPokemons }) => {
  const bg = useColorModeValue("white", "gray.800")

  return (
    <HStack
      spacing="5"
      justify="center"
      pt={14}
      pb={5}
      position="fixed"
      top={0}
      left={0}
      w="100%"
      bgColor={bg}
      zIndex={1}
    >
      <Checkbox onChange={handleFilter} isChecked={filter === "all"} name="all">
        All ({pokemon.length})
      </Checkbox>
      <Checkbox
        onChange={handleFilter}
        isChecked={filter === "catched"}
        name="catched"
      >
        Catched ({catchedPokemons.length})
      </Checkbox>
      <Checkbox
        onChange={handleFilter}
        isChecked={filter === "free"}
        name="free"
      >
        Free ({pokemon.length - catchedPokemons.length})
      </Checkbox>
    </HStack>
  )
}
