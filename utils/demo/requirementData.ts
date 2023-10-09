interface IRequirementData {
  id: number;
  description: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

const tableData: IRequirementData[] = [
  {
    id: 6,
    description: "Carnet de identidad.",
    status: "primary",
  },
  {
    id: 7,
    description: "Datos del estudiante.",
    status: "primary",
  },
  {
    id: 8,
    description: "En casos de inicio de semestre se requiere el formulario de inscripciones.",
    status: "primary",
  },
  {
    id: 8,
    description: "Aplica a la modalidad de titulación.",
    status: "primary",
  },
];

export default tableData;
export type { IRequirementData };
