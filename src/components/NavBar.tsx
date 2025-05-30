import { Flex, Heading } from "@chakra-ui/react";

const NavBar = () => {
  return (
    <Flex bg="brown" as="nav" p="10px" alignItems="center">
      <Heading as="h1">Dama player</Heading>
      {/* <Text>logout</Text> */}
    </Flex>
  );
};

export default NavBar;
