import { useEffect, useState } from "react";
import { fetchData, User } from "./api-client"; // Assuming you have defined the fetchData function separately
import useId from "./useId";

const useNames = () => {
  const [id, updateId] = useId();
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData<User[]>("/api/v1/users", id) // Assuming fetchData returns Promise<FetchResponse<User[]>>
      .then((response) => {
        setData(response.data); // Extract 'results' from the response
        setError(null);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Failed to fetch data");
        updateId("");
        localStorage.removeItem("userId");
        setIsLoading(false);
      });
  }, [id]); // Dependency on id, so useEffect runs when id changes

  return { data, error, isLoading };
};

export default useNames;
