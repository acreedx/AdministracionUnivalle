interface IRequirementData {
  id: number;
  description: string;
}

function convertJSONRequirement(data: any) {
  const convertedData: IRequirementData = {
    id: data.identificador,
    description: data.descripcion,
  };
  return convertedData;
}
function convertJSONListRequirement(data: any) {
  const convertedListData: IRequirementData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONRequirement(e));
  });
  return convertedListData;
}

const tableData: IRequirementData[] = [
  {
    id: 6,
    description: "Carnet de identidad.",
  },
  {
    id: 7,
    description: "Datos del estudiante.",
  },
  {
    id: 8,
    description:
      "En casos de inicio de semestre se requiere el formulario de inscripciones.",
  },
  {
    id: 8,
    description: "Aplica a la modalidad de titulación.",
  },
];

export default tableData;
export type { IRequirementData };
export { convertJSONRequirement, convertJSONListRequirement };
