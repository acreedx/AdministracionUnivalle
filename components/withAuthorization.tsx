import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "../utils/auth/auth";

interface Module {
  id: number;
  modulo: string;
}

interface WithAuthorizationProps {
  requiredPermissions: string[];
}

const withAuthorization = (WrappedComponent: React.FC, { requiredPermissions }: WithAuthorizationProps) => {
  const WithAuthorization: React.FC = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const checkAccess = async () => {
        const usuarioAutenticado = await isAuthenticated();

        if (!usuarioAutenticado) {
          // Si el usuario no está autenticado, redirigir al login
          router.push("/login");
          return;
        }

        // Obtener módulos del localStorage
        const userModulesString = localStorage.getItem("userModules");

        if (userModulesString) {
          const userModules: Module[] = JSON.parse(userModulesString);

          // Verificar si el usuario tiene al menos uno de los permisos requeridos
          const hasRequiredPermission = userModules.some((module) =>
            requiredPermissions.includes(module.modulo)
          );

          if (!hasRequiredPermission) {
            // Si el usuario no tiene ninguno de los permisos requeridos, redirigir a una página de acceso denegado o a donde desees
            router.push("/example/404");
          }
        }
      };

      checkAccess();
    }, []);

    return <WrappedComponent {...props} />;
  };

  // Asigna un displayName al HOC
  WithAuthorization.displayName = `WithAuthorization(${getDisplayName(WrappedComponent)})`;

  return WithAuthorization;
};

// Función para obtener el nombre de visualización de un componente
function getDisplayName(WrappedComponent: React.FC) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuthorization;
