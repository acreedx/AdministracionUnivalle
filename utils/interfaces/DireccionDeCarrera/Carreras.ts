export interface IFaculty {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface ICarrers {
  id?: number;
  titulo: string;
  descripcion: string;
  tituloOtorgado: string;
  duracion: number;
  planDeEstudios: string;
  brochure: string;
  imagen: string;
  facultadId: number;
  estado: boolean;
  fechaCreacion: string;
  oFacultad: IFaculty;
}


export interface IAddCarrer {
  titulo: string;
  descripcion: string;
  tituloOtorgado: string;
  duracion: number;
  planDeEstudios: string;
  imagen: string;
  facultadId: number;
}

export interface ICarrersData {
  id: number;
  titulo: string;
  descripcion: string;
  tituloOtorgado: string;
  duracion: number;
  planDeEstudios: string;
  imagen: string;
  facultadId: number;
}

function convertJSONCarrer(data: any) {
  const convertedData: ICarrersData = {
    id: data.id,
    titulo: data.titulo, 
    descripcion: data.descripcion, 
    tituloOtorgado: data.tituloOtorgado, 
    duracion: data.duracion, 
    planDeEstudios: data.planDeEstudios, 
    imagen: data.imagen, 
    facultadId: data.facultadId,
  };
  return convertedData;
}

interface IFacultiesData {
  id: number;
  titulo: string;
  estado: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONFaculty(data: any) {
  const convertedData: IFacultiesData = {
    id: data.id,
    titulo: data.titulo,
    estado: data.estado == true ? "success" : "danger",
  };
  return convertedData;
}
function convertJSONListFaculty(data: any) {
  const convertedListData: IFacultiesData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONFaculty(e));
  });
  return convertedListData;
}

export type { IFacultiesData };
export { convertJSONFaculty, convertJSONListFaculty, convertJSONCarrer};

