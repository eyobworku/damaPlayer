import { useState } from "react";

const useId = (): [string | null, (newId: string) => void] => {
  const userId = localStorage.getItem("userId");

  const [id, setId] = useState<string | null>(userId !== null ? userId : null);

  // Function to update id in localStorage and state
  const updateId = (newId: string) => {
    localStorage.setItem("userId", newId);
    setId(newId);
  };

  return [id, updateId];
};

export default useId;
