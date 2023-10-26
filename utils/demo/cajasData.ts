interface ICajasData {
  id: number;
  name: string;
  ubicacionId: number;
  ubicacion: string;
  enchargedId: number;
  encharged: string;
  imagenUrl: string;
  cellphone: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONService(data: any) {
  const convertedData: ICajasData = {
    id: data.id,
    name: data.nombre,
    ubicacionId: data.ubicaciones[0]?.id,
    ubicacion: data.ubicaciones[0]?.descripcion,
    enchargedId: data.referencia[0].id,
    imagenUrl: data.imagenUrl,
    encharged: data.referencia[0].nombre,
    cellphone: data.referencia[0].numerocel,
    status: data.estado == true ? "success" : "danger",
  };
  return convertedData;
}
function convertJSONListService(data: any) {
  const convertedListData: ICajasData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONService(e));
  });
  return convertedListData;
}

const tableData: ICajasData[] = [
  {
    id: 6,
    name: "Cobro de Colegiatura",
    ubicacionId: 1,
    ubicacion: "Torre innovación, Planta Baja",
    enchargedId: 1,
    imagenUrl: "",
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },

  {
    id: 7,
    name: "Cobro de Trámites",
    ubicacionId: 1,
    ubicacion: "Torre innovación, Planta Baja",
    enchargedId: 1,
    imagenUrl: "",
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },
  {
    id: 8,
    name: "Cobro de Cheques",
    ubicacionId: 1,
    imagenUrl: "",
    ubicacion: "Torre innovación, Planta Baja",
    enchargedId: 1,
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },
];

export default tableData;
export type { ICajasData };
export { convertJSONService, convertJSONListService };
