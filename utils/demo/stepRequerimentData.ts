interface IStepRequirementData {
  idStep: number;
  name: string;
  requeriment: string;
}

function convertJSONRequirement(data: any) {
  const convertedData: IStepRequirementData = {
    idStep: data.identificador,
    name: data.nombre,
    requeriment: data.requisito,
  };
  return convertedData;
}
function convertJSONListRequirementStep(data: any) {
  const convertedListData: IStepRequirementData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONRequirement(e));
  });
  return convertedListData;
}

export type { IStepRequirementData };
export { convertJSONRequirement, convertJSONListRequirementStep };
