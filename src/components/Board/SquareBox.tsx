import { Box, Image } from "@chakra-ui/react";
import cocka from "../../assets/coca-cola-png-41660.png";
import fanta from "../../assets/Fanta.webp";
import { useEffect, useState } from "react";
import { Korki } from "../../types/korki";
import blClown from "../../assets/black_crown.png";

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
    <Box
      position="relative"
      display="inline-block"
      bg={korki ? "blue.200" : "black"}
      // borderRadius="40px"
      overflow="hidden"
      height="75px"
      width="75px"
      cursor={korki ? "pointer" : "default"}
      onClick={() => {
        if (korki) {
          onSelectSquare(korki);
        }
      }}
      userSelect="none"
    >
      {korki !== null && (
        <>
          {imageSrc && (
            <Image
              src={imageSrc}
              borderRadius="40px"
              border={
                korki.selected === 1
                  ? "4px solid red"
                  : korki.selected === 2
                  ? "4px solid white"
                  : "none"
              }
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
        </>
      )}
    </Box>
  );
};

export default SquareBox;
