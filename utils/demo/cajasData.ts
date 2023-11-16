interface ICajasData {
  id: number;
  name: string;
  ubicacionId: number;
  ubicacion: string;
  enchargedId: number;
  encharged: string;
  imagenUrl: string;
  cellphone: string;
  status: "success" | "danger";
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

export type { ICajasData };
export { convertJSONService, convertJSONListService };
