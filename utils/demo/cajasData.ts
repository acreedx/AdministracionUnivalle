interface ICajasData {
  id: number;
  name: string;
  ubicacion: string;
  encharged: string;
  cellphone: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
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
