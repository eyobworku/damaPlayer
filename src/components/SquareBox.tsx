import { Box, Button, Image } from "@chakra-ui/react";
import cocka from "../assets/coca-cola-png-41660.png";
import fanta from "../assets/Fanta.webp";
import { useEffect, useState } from "react";
import { Korki } from "../hooks/useKorki";
import blClown from "../assets/black_crown.png";

interface Props {
  onSelectSquare: (selKorki: Korki) => void;
  korki: Korki | null;
}

const SquareBox = ({ onSelectSquare, korki }: Props) => {
  const [imageSrc, setImageSrc] = useState(
    korki?.type === 1 ? fanta : korki?.type === 2 ? cocka : ""
  );

  useEffect(() => {
    setImageSrc(korki?.type === 1 ? fanta : korki?.type === 2 ? cocka : "");
  }, [korki?.type, fanta, cocka]);
  return (
    <>
      <Box
        position="relative"
        display="inline-block"
        bg={korki === null ? "black" : "blue.200"}
      >
        <Box
          borderRadius="40px"
          overflow="hidden"
          height="75px"
          width="75px"
          position="relative"
        >
          {korki !== null && (
            <>
              {imageSrc && (
                <Image
                  src={imageSrc}
                  borderRadius="40px"
                  border={korki.selected === 1 ? "4px solid red" : "none"}
                  height="100%"
                  width="100%"
                  objectFit="cover"
                  zIndex="0"
                />
              )}
              {korki.nigus && (
                <Image
                  src={blClown}
                  borderRadius="50%"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width="55px" // Adjust crown size here
                  height="auto" // Maintain aspect ratio
                  zIndex="1"
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
                zIndex="2"
                onClick={() => {
                  onSelectSquare(korki);
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
