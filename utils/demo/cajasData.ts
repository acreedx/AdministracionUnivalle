interface ICajasData {
  id: number;
  name: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

const tableData: ICajasData[] = [
  {
    id: 6,
    name: "Cobro de Colegiatura",
    status: "neutral",
  },
  {
    id: 7,
    name: "Cobro de Trámites",
    status: "neutral",
  },
  {
    id: 8,
    name: "Cobro de Cheques",
    status: "neutral",
  },
];

export default tableData;
export type { ICajasData };
