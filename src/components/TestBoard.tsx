import { Box, Center, Flex } from "@chakra-ui/react";
import SquareBox from "./SquareBox";

const TestBoard = () => {
  return (
    <Box p={5}>
      <Center>
        <Box>
          <Flex>
            <SquareBox customKey="00" typeOfBox={0} />
            <SquareBox customKey="01" typeOfBox={1} />
          </Flex>
          <Flex>
            <SquareBox customKey="10" typeOfBox={1} />
            <SquareBox customKey="11" typeOfBox={0} />
          </Flex>
        </Box>
      </Center>
    </Box>
  );
};

export default TestBoard;
