interface ICajasData {
  id: number;
  name: string;
  ubicacion: string;
  encharged: string;
  cellphone: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONService(data: any) {
  const convertedData: ICajasData = {
    id: data.id,
    name: data.nombre,
    ubicacion: data.ubicaciones[0].descripcion,
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
    ubicacion: "Torre innovación, Planta Baja",
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },

  {
    id: 7,
    name: "Cobro de Trámites",
    ubicacion: "Torre innovación, Planta Baja",
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },
  {
    id: 8,
    name: "Cobro de Cheques",
    ubicacion: "Torre innovación, Planta Baja",
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },
];

export default tableData;
export type { ICajasData };
export { convertJSONService, convertJSONListService };
