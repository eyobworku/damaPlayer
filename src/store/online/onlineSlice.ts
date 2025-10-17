import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  roomId: string;
  playerId: string;
  mode: "one" | "two" | null;
  online: boolean;
  isMyTurn: boolean;
} = {
  roomId: "",
  playerId: "",
  mode: null,
  online: false,
  isMyTurn: false,
};
const onlineSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setPlayerId: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setMode: (state, action: PayloadAction<"one" | "two" | null>) => {
      state.mode = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setIsMyTurn: (state, action: PayloadAction<boolean>) => {
      state.isMyTurn = action.payload;
    },
  },
});
export const { setRoomId, setPlayerId, setMode, setOnline, setIsMyTurn } =
  onlineSlice.actions;
export default onlineSlice.reducer;
