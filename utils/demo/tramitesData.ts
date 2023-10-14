interface ITramitesData {
  id: number;
  name: string;
  enchargedId: number;
  encharged: string;
  cellphone: string;
  duration: string;
  //  category: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONService(data: any) {
  const convertedData: ITramitesData = {
    id: data.id,
    name: data.nombre,
    enchargedId: data.referencia[0].id,
    encharged: data.referencia[0].nombre,
    cellphone: data.referencia[0].numerocel,
    duration: data.referencia[0].duracion,
    //  locationId: data.ubicaciones[0].id,
    // location: data.ubicaciones[0].descripcion,
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
