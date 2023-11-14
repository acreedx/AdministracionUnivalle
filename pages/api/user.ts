import axios, { AxiosResponse } from "axios";

const API_URL = "https://apisistemaunivalle.somee.com/api";

interface User {
  ciUsuario: string;
  clave: string;
}

export async function loginUser(
  ciUsuario: string,
  clave: string
): Promise<User> {
  try {
    const response: AxiosResponse<User> = await axios.post(`${API_URL}/Login/login`,
      {
        ciUsuario,
        clave,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error.message);
    throw new Error("Error al iniciar sesión");
  }
}
