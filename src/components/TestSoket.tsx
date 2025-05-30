import { useEffect, useState } from "react";
import useId from "../services/useId";
import useNames from "../services/useNames";
import "../index.css";
import { socket } from "../services/socket-client";
import { Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface GameState {
  id: number;
  firstPlayer: string;
  secondPlayer: string;
  currentPlayer: string;
}

const TestSoket = () => {
  const navigate = useNavigate();
  const [id] = useId();
  const [userSocketMap, setUserSocketMap] = useState(new Map());
  const { data } = useNames();
  console.log(data);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [playRequest, setPlayRequest] = useState("");
  const [gameState, setGameState] = useState<GameState>();

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Clean up socket event listener
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (typeof id === "string") {
      socket.emit("setUserId", id);
    }

    return () => {
      socket.off("setUserId");
    };
  }, [id]);

  useEffect(() => {
    function updateUserSocketMap(
      updatedUserSocketMap: Iterable<readonly [any, any]> | null | undefined
    ) {
      setUserSocketMap(new Map(updatedUserSocketMap));
    }

    socket.on("game status", (gameState) => {
      setGameState(gameState);
      navigate(`/board?gameId=${gameState.id}`);
      console.log(gameState);
    });

    socket.on("play request 2", (firstPlayer) => {
      setPlayRequest(firstPlayer);
    });
    socket.on("updateUserSocketMap", updateUserSocketMap);

    return () => {
      socket.off("updateUserSocketMap", updateUserSocketMap);
      socket.off("game status");
    };
  }, []);
  const handleMessageSend = () => {
    //chat
    if (inputMessage.trim() !== "") {
      socket.emit("message", inputMessage);
      setInputMessage("");
    }
  };
  const sendPlayReq = (userId: string) => {
    socket.emit("play request", userId);
  };
  const acceptRequest = () => {
    socket.emit("accept request", playRequest, id);
    setPlayRequest("");
  };
  const flipGSByClick = () => {
    if (gameState !== undefined) {
      socket.emit("update game state", gameState);
    }
  };
  return (
    <>
      <div>
        {data && data.length > 0 && (
          <div>
            <p>ID: {data[0]._id}</p>
            <p>Name: {data[0].name}</p>
            <p>Avatar: {data[0].avatar}</p>
          </div>
        )}
        <h2>Online Users:</h2>
        <ul>
          {Array.from(userSocketMap).map(
            ([userId, socketId]) =>
              id !== userId && (
                <li key={userId}>
                  User ID:{" "}
                  <Link
                    onClick={() => {
                      sendPlayReq(userId);
                    }}
                  >
                    {userId}
                  </Link>
                  , Socket ID: {socketId}
                </li>
              )
          )}
        </ul>
      </div>
      <div>
        <h1>Socket.io Chat</h1>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>

      {playRequest !== "" && (
        <div>
          <p>Play request from {playRequest}</p>
          <button onClick={acceptRequest}>Accept</button>
        </div>
      )}
      {gameState !== undefined && (
        <div>
          <p>current player {gameState.currentPlayer}</p>
          <button
            onClick={flipGSByClick}
            disabled={gameState.currentPlayer !== id}
          >
            Click Flip
          </button>
        </div>
      )}
    </>
  );
};

export default TestSoket;
