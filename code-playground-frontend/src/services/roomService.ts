import axios from "axios";

export const createRoom = async (ownerName: string) => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE_URL}/rooms/create`,
      { ownerName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};
