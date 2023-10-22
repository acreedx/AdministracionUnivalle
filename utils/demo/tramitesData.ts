interface ITramitesData {
  id: number;
  name: string;
  enchargedId: number;
  encharged: string;
  cellphone: string;
  //duration: string;
  //  category: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONService(data: any) {
  const convertedData: ITramitesData = {
    id: data.id,
    name: data.nombre,
    enchargedId:
      data.referencia && data.referencia[0]
        ? data.referencia[0].enchargedId
        : null,
    encharged:
      data.referencia && data.referencia[0] ? data.referencia[0].nombre : null,
    cellphone:
      data.referencia && data.referencia[0]
        ? data.referencia[0].numerocel
        : null,
    // duration: data.referencia[0].duracion,
    //category: data.categorias[0].nombre,
    status: data.estado == true ? "success" : "danger",
  };
  return convertedData;
}
function convertJSONListService(data: any) {
  const convertedListData: ITramitesData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONService(e));
  });
  return convertedListData;
}
/*
const tableData: ITramitesData[] = [
  {
    id: 6,
    name: "Cobro de Colegiatura",
    locationId: 1,
    location: "Torre innovación, Planta Baja",
    enchargedId: 1,
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },

  {
    id: 7,
    name: "Cobro de Trámites",
    ubicacionId: 1,
    ubicacion: "Torre innovación, Planta Baja",
    enchargedId: 1,
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },
  {
    id: 8,
    name: "Cobro de Cheques",
    ubicacionId: 1,
    ubicacion: "Torre innovación, Planta Baja",
    enchargedId: 1,
    encharged: "Daniel",
    cellphone: "1234567",
    status: "neutral",
  },
];
*/
export type { ITramitesData };
export { convertJSONService, convertJSONListService };
