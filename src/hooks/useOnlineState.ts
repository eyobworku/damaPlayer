import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const useOnlineState = () => {
  const { online, roomId, playerId, mode, isMyTurn } = useSelector(
    (state: RootState) => state.online
  );
  return { online, roomId, playerId, mode, isMyTurn };
};
export default useOnlineState;
