import axios, { AxiosInstance, AxiosResponse } from "axios";

// Create Axios instance
const API: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

// Define types for response data
export interface FetchResponse<T> {
  success: boolean;
  data: T;
}
export interface User {
  _id?: string;
  name: string;
  avatar: string;
}

// Function to perform a GET request
export const fetchData = async <T>(
  endpoint: string,
  id?: string | null,
  params: any = {}
): Promise<FetchResponse<T>> => {
  try {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response: AxiosResponse<FetchResponse<T>> = await API.get(url, {
      params,
    });
    if (!response.data.success) {
      throw new Error("Request was not successful");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to perform a POST request
const postData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await API.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const postDataExample = async <T>(user: User) => {
  try {
    const data = await postData<FetchResponse<T>>("/api/v1/users", user);
    return data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

// postDataExample();
