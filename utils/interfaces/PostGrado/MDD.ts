export interface IMaestrias {
  id: number;
  titulo: string;
  modalidad: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface IDoctorados {
  id: number;
  titulo: string;
  modalidad: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: string;
}


export interface IDiplomados {
  id: number;
  titulo: string;
  modalidad: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface IAddMaestria {
  titulo: string;
  modalidad: string;
  imagen: string;
}

export interface IAddDoctorado {
  titulo: string;
  modalidad: string;
  imagen: string;
}

export interface IAddDiplomado {
  titulo: string;
  modalidad: string;
  imagen: string;
}

interface IMaestriaData {
  id: number;
  titulo: string;
  modalidad: string;
  imagen: string;
  estado: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

function convertJSONMaestria(data: any) {
  const convertedData: IMaestriaData = {
    id: data.id,
    titulo: data.titulo, 
    modalidad: data.modalidad, 
    imagen: data.imagen,
    estado: data.estado,
  };
  return convertedData;
}

function convertJSONListMaestria(data: any) {
  const convertedListData: IMaestriaData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONMaestria(e));
  });
  return convertedListData;
}

interface IDoctoradoData {
  id: number;
  titulo: string;
  modalidad: string;
  imagen: string;
  estado: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

function convertJSONDoctorado(data: any) {
  const convertedData: IDoctoradoData = {
    id: data.id,
    titulo: data.titulo, 
    modalidad: data.modalidad, 
    imagen: data.imagen,
    estado: data.estado,
  };
  return convertedData;
}

function convertJSONListDoctorado(data: any) {
  const convertedListData: IDoctoradoData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONMaestria(e));
  });
  return convertedListData;
}

interface IDiplomadoData {
  id: number;
  titulo: string;
  modalidad: string;
  imagen: string;
  estado: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

function convertJSONDiplomado(data: any) {
  const convertedData: IDiplomadoData = {
    id: data.id,
    titulo: data.titulo, 
    modalidad: data.modalidad, 
    imagen: data.imagen,
    estado: data.estado,
  };
  return convertedData;
}

function convertJSONListDiplomado(data: any) {
  const convertedListData: IDiplomadoData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONMaestria(e));
  });
  return convertedListData;
}

export type { IMaestriaData, IDoctoradoData, IDiplomadoData };
export { convertJSONListMaestria, convertJSONMaestria, convertJSONDoctorado, convertJSONListDoctorado, convertJSONDiplomado, convertJSONListDiplomado};

