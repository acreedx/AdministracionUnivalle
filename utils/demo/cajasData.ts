interface ICajasData {
  id: number;
  name: string;
  ubicacion: string;
  encharged: string;
  cellphone: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertirJson(data: any) {
    const convertedData : ICajasData = {
      id: data.id,
      name: data.name,
      ubicacion: data.ubicaciones[0].description,
      encharged: data.referencia[0].nombre,
      cellphone: data.referencia[0].numerocel,
      status: data.estado ? "success" : "danger"
    };
    return convertedData;
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
export type { convertirJson };
