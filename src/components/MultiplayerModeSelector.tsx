import { useState, useEffect } from "react";
import socket from "../utils/socket";
import { useNavigate, redirect } from "react-router-dom";

export default function MultiplayerModeSelector() {
  const [roomId, setRoomId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [mode, setMode] = useState<"one" | "two" | null>(null);
  const [generatedId, setGeneratedId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("gameCreated", (id) => {
      setRoomId(id);
      setGeneratedId(id);
    });

    socket.on("gameStart", () => {
      setGameStarted(true);
      setIsMyTurn(true); // creator starts
    });
    socket.on("playerJoined", (state: any) => {
      console.log(state);
      navigate(`/board?mode=online&gameId=${roomId}`);
    });

    socket.on("gameJoined", (id: string) => {
      setRoomId(id);
      navigate(`/board?mode=online&gameId=${id}`);
    });

    // Listen for the player's ID
    socket.on("me", (id) => {
      setPlayerId(id);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("gameStart");
      socket.off("playerJoined");
      socket.off("gameJoined");
      socket.off("me");
    };
  }, [roomId]);

  const createRoom = () => {
    socket.emit("createGame");
  };

  const joinRoom = () => {
    socket.emit("joinGame", roomId);
  };

  const copyRoom = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      // small visual feedback could be added
      alert("Room ID copied to clipboard");
    } catch (e) {
      alert("Unable to copy — select and copy manually: " + roomId);
    }
  };

  const handleJoin = () => {
    if (!roomId) return alert("Enter a room ID to join");
    joinRoom();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-2">Multiplayer setup</h1>
        <p className="text-sm text-gray-500 mb-6">
          Choose how you want to play: on the same computer or with another
          player over the network.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setMode("one")}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-shadow duration-150 text-left ${
              mode === "one"
                ? "border-indigo-500 shadow-md"
                : "border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3a2 2 0 002 2h10z"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium">One computer (Local)</div>
              <div className="text-sm text-gray-500">
                Two players on the same machine. Fast and simple.
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode("two")}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-shadow duration-150 text-left ${
              mode === "two"
                ? "border-indigo-500 shadow-md"
                : "border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7v6a4 4 0 004 4h8a4 4 0 004-4V7"
                />
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V5a4 4 0 014-4h0a4 4 0 014 4v2"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium">Two computers (Online)</div>
              <div className="text-sm text-gray-500">
                Create a game and share a room ID, or join a friend's game.
              </div>
            </div>
          </button>
        </div>

        <div className="mt-4">
          {mode === "one" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => navigate("/board?mode=local")}
                >
                  Start Local Game
                </button>
              </div>
            </div>
          )}

          {mode === "two" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">Create a game</div>
                  <p className="text-xs text-gray-500 mb-3">
                    Generate a room ID and share it with your friend.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={createRoom}
                      className="flex-1 px-4 py-2 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50"
                    >
                      Generate Room ID
                    </button>
                    <button
                      onClick={() => {
                        if (generatedId) copyRoom();
                      }}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
                      disabled={!generatedId}
                    >
                      Copy
                    </button>
                  </div>
                  {generatedId && (
                    <div className="mt-3 p-2 bg-gray-100 rounded text-sm font-mono">
                      {generatedId}
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium mb-2">Join a game</div>
                  <p className="text-xs text-gray-500 mb-3">
                    Enter the room ID you received and join.
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      placeholder="ROOM ID"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
                    />
                    <button
                      onClick={handleJoin}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Join
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Tip: share the Room ID via chat, email, or a QR code. Plug
                    socket logic into the handlers provided to actually
                    create/join the socket room.
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() =>
                    alert(
                      "Ready — integrate onCreateRoom / onJoinRoom to connect sockets"
                    )
                  }
                >
                  Ready
                </button>
              </div>
            </div>
          )}

          {!mode && (
            <div className="text-sm text-gray-500">
              Select a mode to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
