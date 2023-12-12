import axios, { AxiosResponse } from "axios";

const API_URL = "https://apisistemaunivalle.somee.com/api";

interface User {
  ciUsuario: string;
  clave: string;
}

interface Module {
  id: number;
  modulo: string;
}

interface ApiResponse {
  success: number;
  message: string | null;
  data: {
    modulos: Module[];
  }[];
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


export async function getModulesByUserCI(ciUsuario: string): Promise<Module[]> {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(
      `${API_URL}/Permisos/getModulosByUserCI/${ciUsuario}`
    );

    const responseData = response.data;

    // Verificar si la solicitud fue exitosa
    if (responseData.success === 1) {
      // Obtener los módulos desde la respuesta
      const modules = responseData.data[0].modulos;

      return modules;
    } else {
      // Manejar caso de respuesta no exitosa
      throw new Error(responseData.message || "Error en la respuesta de la API");
    }
  } catch (error: any) {
    console.error("Error al obtener módulos:", error.message);
    throw new Error("Error al obtener módulos");
  }
}