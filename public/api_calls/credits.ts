import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export async function getCredits(userId: string) {
  try {
    const res = await axios.get(`/api/credits?userId=${userId}`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error?.response?.data?.message || "Error fetching credits");
      return null;
    }
    toast.error("Error fetching credits");
    return null;
  }
}
