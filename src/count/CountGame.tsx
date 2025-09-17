import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface GameState {
  count: number;
  currentPlayer: string;
  players: string[];
}

const CountGame: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string>("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Connect to the server
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Set up event listeners
    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    newSocket.on("gameCreated", (id: string) => {
      setGameId(id);
      setError("");
    });

    newSocket.on("gameJoined", (id: string) => {
      setGameId(id);
      setError("");
    });

    newSocket.on("playerJoined", (state: GameState) => {
      setGameState(state);
      setError("");
    });

    newSocket.on("playerLeft", (state: GameState) => {
      setGameState(state);
    });

    newSocket.on("countUpdated", (state: GameState) => {
      setGameState(state);
      setError("");
    });

    newSocket.on("error", (message: string) => {
      setError(message);
    });

    // Clean up on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const createGame = () => {
    if (socket) {
      socket.emit("createGame");
    }
  };

  const joinGame = (id: string) => {
    if (socket) {
      socket.emit("joinGame", id);
    }
  };

  const incrementCount = () => {
    if (socket && gameId) {
      socket.emit("increment", gameId);
    }
  };

  const copyLink = () => {
    if (gameId) {
      const link = `${window.location.origin}?game=${gameId}`;
      navigator.clipboard
        .writeText(link)
        .then(() => alert("Game link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };
  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  // Check for game ID in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get("game");
    if (gameParam && socket && isConnected) {
      joinGame(gameParam);
    }
  }, [socket, isConnected]);

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-red-500">Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!gameId ? (
        <div className="text-center">
          <button
            onClick={createGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create New Game
          </button>

          <div className="mt-4">
            <p className="text-gray-600 mb-2">Or join an existing game:</p>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter Game ID"
                className="flex-grow border border-gray-300 rounded-l px-4 py-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    joinGame(e.currentTarget.value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector("input");
                  if (input) joinGame(input.value);
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Game ID: {gameId}</h2>
            <button
              onClick={copyLink}
              className="text-blue-500 hover:text-blue-700 text-sm mt-1"
            >
              Copy invite link
            </button>
          </div>

          {gameState && (
            <>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-4xl font-bold">{gameState.count}</p>
                <p className="text-gray-600 mt-2">
                  {gameState.players.length} player
                  {gameState.players.length !== 1 ? "s" : ""} in game
                </p>
              </div>

              <button
                onClick={incrementCount}
                disabled={socket?.id !== gameState.currentPlayer}
                className={`py-2 px-4 rounded font-bold ${
                  socket?.id === gameState.currentPlayer
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {socket?.id === gameState.currentPlayer
                  ? "Increment Count"
                  : "Other Player's Turn"}
              </button>

              <div className="mt-4 text-left">
                <p className="font-semibold">Players:</p>
                <ul className="list-disc list-inside">
                  {gameState.players.map((player, index) => (
                    <li
                      key={player}
                      className={
                        player === gameState.currentPlayer
                          ? "text-green-600 font-bold"
                          : ""
                      }
                    >
                      Player {index + 1} {player === socket?.id ? "(You)" : ""}
                      {player === gameState.currentPlayer
                        ? " (Current Turn)"
                        : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CountGame;
