/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

interface IRoute {
  path?: string;
  icon?: string;
  name: string;
  routes?: IRoute[];
  checkActive?(pathname: String, route: IRoute): boolean;
  exact?: boolean;
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname == route?.path
    : route?.path
    ? pathname.indexOf(route.path) === 0
    : false;
}

const routes: IRoute[] = [
  {
    path: "/example", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
    exact: true,
  },
  {
    path: "/example/forms",
    icon: "FormsIcon",
    name: "Forms",
    routes: [
      {
        path: "/administracion/cajas",
        name: "Listar",
      },
      {
        path: "/administracion/cajas/crear",
        name: "Crear",
      },
    ],
  },
  {
    icon: "PagesIcon",
    name: "Servicios",
    routes: [
      // submenu
      {
        path: "/servicios/cafeteria",
        name: "Cafeteria",
      },
      {
        path: "/example/create-account",
        name: "Create account",
      },
      {
        path: "/example/forgot-password",
        name: "Forgot password",
      },
    ],
  },
  {
    path: "/example/forms",
    icon: "FormsIcon",
    name: "Forms",
  },
  {
    path: "/example/cards",
    icon: "CardsIcon",
    name: "Cards",
  },
  {
    path: "/example/charts",
    icon: "ChartsIcon",
    name: "Charts",
  },
  {
    path: "/example/buttons",
    icon: "ButtonsIcon",
    name: "Buttons",
  },
  {
    path: "/example/modals",
    icon: "ModalsIcon",
    name: "Modals",
  },
  {
    path: "/example/tables",
    icon: "TablesIcon",
    name: "Tables",
  },
  {
    icon: "PagesIcon",
    name: "Pages",
    routes: [
      // submenu
      {
        path: "/example/login",
        name: "Login",
      },
      {
        path: "/example/create-account",
        name: "Create account",
      },
      {
        path: "/example/forgot-password",
        name: "Forgot password",
      },
      {
        path: "/example/404",
        name: "404",
      },
      {
        path: "/example/blank",
        name: "Blank",
      },
    ],
  },
  {
    path: "/bienestarUniversitario",
    icon: "BienestarIcon",
    name: "Bienestar Universitario",
    routes: [
      {
        path: "/bienestarUniversitario/paginaPrincipal/1",
        name: "Datos Generales",
      },
      {
        path: "/bienestarUniversitario/listarObjPerdidos/",
        name: "Listar Objetos Perdidos",
      },
      {
        path: "/bienestarUniversitario/agregarObjPerdido",
        name: "Agregar Objeto Perdido",
      },
      {
        path: "/bienestarUniversitario/listarServicios",
        name: "Listar Servicios",
      },
      {
        path: "/bienestarUniversitario/registrar",
        name: "Registrar Servicio",
      },
    ],
    exact: true,
  },
  {
    path: "/gabineteMedico",
    icon: "MedicineIcon",
    name: "Gabinete Medico",
    routes: [
      {
        path: "/gabineteMedico/paginaPrincipal/2",
        name: "Datos Generales",
      },
      {
        path: "/gabineteMedico/listarServicios",
        name: "Listar Servicios",
      },
      {
        path: "/gabineteMedico/registrar",
        name: "Registrar Servicio",
      },
    ],
    exact: true,
  },
  {
    path: "/gabinetePsicoPedagogico",
    icon: "MindIcon",
    name: "Gabinete Psico-Pedagogico",
    routes: [
      {
        path: "/gabinetePsicoPedagogico/paginaPrincipal/3",
        name: "Pagina Principal",
      },
      {
        path: "/gabinetePsicoPedagogico/listarServicios",
        name: "Listar Servicios",
      },
      {
        path: "/gabinetePsicoPedagogico/registrar",
        name: "Registrar Servicio",
      },
    ],
    exact: true,
  },
  {
    path: "/consultorioOdontologico",
    icon: "DentistIcon",
    name: "Consultorio Odontologico",
    routes: [
      {
        path: "/consultorioOdontologico/paginaPrincipal/4",
        name: "Datos Generales",
      },
      {
        path: "/consultorioOdontologico/listarServicios",
        name: "Listar Servicios",
      },
      {
        path: "/consultorioOdontologico/registrar",
        name: "Registrar Servicio",
      },
    ],
    exact: true,
  },
];

export type { IRoute };
export default routes;
