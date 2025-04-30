import { userList } from "@/types/admin";
import { handleApiError } from "@/utils/api-errors";

export class UsersService {
  /**
   * Fetch all users
   */
  static async getUsers(accessToken: string): Promise<userList[]> {
    try {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, "Failed to load users");
    }
  }

  /**
   * Register a new user
   */
  static async registerUser(
    data: {
      username: string;
      email: string;
      password: string;
      role: string;
    },
    accessToken: string
  ): Promise<any> {
    try {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, "Failed to register user");
    }
  }
}
