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
    path: "/home", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Inicio", // name that appear in Sidebar
    exact: true,
  },
  {
    path: "/example/forms",
    icon: "FormsIcon",
    name: "Cajas",
    routes: [
      {
        path: "/administracion/cajas",
        name: "Listar Servicios",
      },
    ],
  },
  {
    path: "/example/forms",
    icon: "FormsIcon",
    name: "Tramites",
    routes: [
      {
        path: "/administracion/tramites",
        name: "Listar tramites",
      },
    ],
  },
  {
    path: "/example/forms",
    icon: "FormsIcon",
    name: "Tipos de tramites",
    routes: [
      {
        path: "/administracion/tramites/categorias",
        name: "Listar categorias",
      },
    ],
  },
  {
    path: "/example/forms",
    icon: "FormsIcon",
    name: "Dirección de carrera",
    routes: [
      {
        path: "/administracion/direccionDeCarrera/carrera",
        name: "Carreras",
      },
      {
        path: "/administracion/direccionDeCarrera/facultad",
        name: "Facultades",
      },
    ],
  },
  {
    path: "/servicios/cafeteria",
    icon: "PagesIcon",
    name: "Servicios",
    routes: [
      // submenu
      {
        path: "/servicios/cafeteria",
        name: "Cafeteria",
      },
      {
        path: "/servicios/biblioteca",
        name: "Biblioteca",
      },
    ],
  },

  {
    path: "/usuarios",
    icon: "PeopleIcon",
    name: "Usuarios",
    routes: [
      {
        path: "/usuarios/listarUsuarios",
        name: "Listar Usuarios",
      },
      {
        path: "/usuarios/registrar",
        name: "Registrar",
      },
    ],
    exact: true,
  },
  {
    path: "/bienestarUniversitario",
    icon: "BienestarIcon",
    name: "Bienestar Universitario",
    routes: [
      {
        path: "/bienestarUniversitario/datosGenerales/1",
        name: "Datos Generales",
      },
      {
        path: "/bienestarUniversitario/listarObjPerdidos/",
        name: "Objetos Perdidos",
      },
      {
        path: "/bienestarUniversitario/listarServicios",
        name: "Servicios",
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
        path: "/gabineteMedico/datosGenerales/15",
        name: "Datos Generales",
      },
      {
        path: "/gabineteMedico/listarServicios",
        name: "Servicios",
      },
    ],
    exact: true,
  },
  {
    path: "/gabinetePsicoPedagogico",
    icon: "MindIcon",
    name: "Gabinete Pedagogico",
    routes: [
      {
        path: "/gabinetePsicoPedagogico/datosGenerales/14",
        name: "Datos Generales",
      },
      {
        path: "/gabinetePsicoPedagogico/listarServicios",
        name: "Servicios",
      },
    ],
    exact: true,
  },
  {
    path: "/consultorioOdontologico",
    icon: "DentistIcon",
    name: "Clínica Odontologica",
    routes: [
      {
        path: "/consultorioOdontologico/datosGenerales/16",
        name: "Datos Generales",
      },
      {
        path: "/consultorioOdontologico/listarServicios",
        name: "Servicios",
      },
    ],
    exact: true,
  },
];

export type { IRoute };
export default routes;
