import { Box, Button, Image } from "@chakra-ui/react";
import cocka from "../assets/coca-cola-png-41660.png";
import fanta from "../assets/Fanta.webp";
import { useEffect, useState } from "react";

interface Props {
  onSelectSquare: (customKey: string) => void;
  typeOfBox: number;
  customKey: string;
  selected: boolean;
}

const SquareBox = ({
  onSelectSquare,
  typeOfBox,
  customKey,
  selected,
}: Props) => {
  const [imageSrc, setImageSrc] = useState(
    typeOfBox === 1 ? fanta : typeOfBox === 2 ? cocka : ""
  );

  useEffect(() => {
    setImageSrc(typeOfBox === 1 ? fanta : typeOfBox === 2 ? cocka : "");
  }, [typeOfBox, fanta, cocka]);
  return (
    <>
      <Box
        position="relative"
        display="inline-block"
        bg={typeOfBox === 0 ? "black" : "blue.200"}
      >
        <Box
          borderRadius="40px"
          overflow="hidden"
          height="75px"
          width="75px"
          position="relative"
        >
          {typeOfBox !== 0 && (
            <>
              {imageSrc && (
                <Image
                  src={imageSrc}
                  borderRadius="40px"
                  border={selected ? "4px solid red" : "none"}
                  height="100%"
                  width="100%"
                />
              )}

              <Button
                variant="unstyled"
                p={0}
                m={0}
                border="none"
                bg="transparent"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                onClick={() => {
                  onSelectSquare(customKey);
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SquareBox;

// <Box
//   display="flex"
//   justifyContent="center"
//   bg={typeOfBox === 1 ? "black" : "blue.200"}
//   h="85px"
//   w="85px"
//   alignItems="center"
// >
//   {typeOfBox !== 1 && (
//     <Button variant="unstyled" p={0} m={0} border="none" bg="transparent">
//       <Image src={fanta} borderRadius="40px" h="75px" w="75px" />
//     </Button>
//   )}
// </Box>
