interface ICategoriasData {
  id: number;
  name: string;
  description: string;
  status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}
function convertJSONCategory(data: any) {
  const convertedData: ICategoriasData = {
    id: data.idCategoria,
    name: data.nombre,
    description: data.descripcion,
    status: data.estado == true ? "success" : "danger",
  };
  return convertedData;
}
function convertJSONListCategory(data: any) {
  const convertedListData: ICategoriasData[] = [];
  data.forEach((e: any) => {
    convertedListData.push(convertJSONCategory(e));
  });
  return convertedListData;
}
/*
const tableData: ICategoriasData[] = [
  {
    id: 1,
    name: "Solicitudes",
    description: "dani",
    status: "success",
  },

  {
    id: 2,
    name: "Certificaciones",
    description: "dani",
    status: "success",
  },
  {
    id: 3,
    name: "Gestiones academicas",
    description: "dani",
    status: "success",
  },
];
*/
//export default tableData;
export type { ICategoriasData };
export { convertJSONCategory, convertJSONListCategory };
