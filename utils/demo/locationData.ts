interface ILocationData {
  id: number;
  description: string;
  img: string;
  croquis: string;
}

function convertJSONLocation(data: any) {
  const convertedData: ILocationData = {
    id: data.identificador,
    description: data.descripcion,
    img: data.imagen,
    croquis: data.video
  };
  return convertedData;
}
function convertJSONListLocation(data: any) {
  const convertedListData: ILocationData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONLocation(e));
  });
  return convertedListData;
}

export type { ILocationData };
export { convertJSONLocation, convertJSONListLocation };
