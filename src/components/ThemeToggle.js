import * as React from "react"
import { useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"

const ColorModeSwitcher = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  return (
    <IconButton
      size="lg"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      pos="fixed"
      zIndex={2}
      top="5px"
      right="15px"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  )
}

export default ColorModeSwitcher
