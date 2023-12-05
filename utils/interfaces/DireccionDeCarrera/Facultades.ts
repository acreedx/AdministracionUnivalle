export interface IFaculties {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface IAddFaculty {
  titulo: string;
  descripcion: string;
  imagen: string;
}

export interface IFacultiesData {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
}

export interface IEditFaculty {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string | null;
}

function convertJSONFaculty(data: any) {
  const convertedData: IFacultiesData = {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    imagen: data.imagen,
  };
  return convertedData;
}

export { convertJSONFaculty };
