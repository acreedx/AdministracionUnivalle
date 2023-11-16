interface ITramitesDataEdit {
  id: number;
  name: string;
  image: string;
  enchargedId: number;
  encharged: string;
  cellphone: string;
  durationId: number;
  duration: string;
  requerimentId: number;
  requeriment: string;
  categoryId: string;

  //  category: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONService(data: any) {
  const convertedData: ITramitesDataEdit = {
    id: data.id,
    name: data.nombre,
    image: data.imagenUrl,
    enchargedId:
      data.referencia && data.referencia[0] ? data.referencia[0].id : null,
    encharged:
      data.referencia && data.referencia[0] ? data.referencia[0].nombre : null,
    cellphone:
      data.referencia && data.referencia[0]
        ? data.referencia[0].numerocel
        : null,
    durationId: data.tramites && data.tramites[0] ? data.tramites[0].id : null,
    duration:
      data.tramites && data.tramites[0] ? data.tramites[0].tiempotramite : null,

    requerimentId:
      data.requisitos && data.requisitos[0] ? data.requisitos[0].id : null,

    requeriment:
      data.requisitos && data.requisitos[0]
        ? data.requisitos[0].descripcion
        : null,
    categoryId: data.categoria,
    status: data.estado == true ? "success" : "danger",
  };
  return convertedData;
}
function convertJSONListServiceEdit(data: any) {
  const convertedListDataEdit: ITramitesDataEdit[] = [];
  data.forEach((e: any) => {
    convertedListDataEdit.push(convertJSONService(e));
  });
  return convertedListDataEdit;
}
export type { ITramitesDataEdit };
export { convertJSONService, convertJSONListServiceEdit };
