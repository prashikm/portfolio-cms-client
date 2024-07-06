import { fetchAccessToken } from "./get-set-token";

const apiService = {
  get: async function (url: string): Promise<any> {
    const token = await fetchAccessToken();

    if (!token) {
      return {
        error: {
          message: "No token found",
        },
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        error: {
          message: data,
        },
      };
    }

    return await response.json();
  },

  getWithoutToken: async function (url: string): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: "GET",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        error: {
          message: data,
        },
      };
    }

    return await response.json();
  },

  post: async function (url: string, data: any): Promise<any> {
    const token = await fetchAccessToken();

    if (!token) {
      return {
        error: {
          message: "No token found",
        },
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        error: {
          message: data,
        },
      };
    }

    return await response.json();
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        error: {
          message: data,
        },
      };
    }

    return await response.json();
  },

  update: async function (url: string, data: any): Promise<any> {
    const token = await fetchAccessToken();

    if (!token) {
      return {
        error: {
          message: "No token found",
        },
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        error: {
          message: data,
        },
      };
    }

    return await response.json();
  },
};

export default apiService;
