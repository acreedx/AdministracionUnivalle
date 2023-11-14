interface UserData {
  data: {
    ciUsuario: string;
    nombres: string;
    apellidos: string;
  }[];
  message: string;
  success: boolean;
}

export const isAuthenticated = (): boolean => {

  if (typeof window === "undefined") {
    return false;
  }

  const userDataString = localStorage.getItem("userData");

  if (userDataString) {
    try {
      const userData: UserData = JSON.parse(userDataString);
      if (
        userData &&
        userData.data &&
        Array.isArray(userData.data) &&
        userData.data.length > 0 &&
        userData.data[0].ciUsuario
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error al analizar datos del usuario:", error);
      return false;
    }
  }
  return false;
};

export const getUserData = (): { nombre: string; apellido: string } | null => {
  const userDataString = localStorage.getItem("userData");

  if (userDataString) {
    try {
      const userData: UserData = JSON.parse(userDataString);

      if (
        userData &&
        userData.data &&
        Array.isArray(userData.data) &&
        userData.data.length > 0 &&
        userData.data[0].nombres &&
        userData.data[0].apellidos
      ) {
        return {
          nombre: userData.data[0].nombres,
          apellido: userData.data[0].apellidos,
        };
      }
    } catch (error) {
      console.error("Error al analizar datos del usuario:", error);
    }
  }

  return null;
};

export const logout = (): void => {
  localStorage.removeItem("userData");
};
