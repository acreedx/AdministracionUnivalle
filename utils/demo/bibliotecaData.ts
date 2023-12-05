interface IBibliotecaData {
  idLibro: number;
  nombreLibro: string;
  nombreAutor: string;
  editorial: string;
  npaginas: number;
  idioma: string;
  anio: number;
  descripcion: string;
  ruta: string;
  estado: boolean;
  // Id: number;
  // Titulo: string; //nombre
  // Descripcion_1: string; //descripcion
  // Descripcion_2: Number; //precio
  // archivo: string; //image

  // status: "success" | "danger" | "warning" | "neutral" | "primary" | undefined;
}

const tableData: IBibliotecaData[] = [
  {
    idLibro: 1,
    nombreLibro: "Libro1",
    nombreAutor: "Autor1",
    editorial: "Editorial1",
    npaginas: 123,
    idioma: "Idioma1",
    anio: 1967,
    descripcion: "Descripcion1",
    ruta: "ruta1",
    estado: true,
  },
  {
    idLibro: 2,
    nombreLibro: "Libro2",
    nombreAutor: "Autor2",
    editorial: "Editorial2",
    npaginas: 1232,
    idioma: "Idioma2",
    anio: 1967,
    descripcion: "Descripcion2",
    ruta: "ruta2",
    estado: true,
  },
  {
    idLibro: 3,
    nombreLibro: "Libro3",
    nombreAutor: "Autor3",
    editorial: "Editorial3",
    npaginas: 323,
    idioma: "Idioma3",
    anio: 1967,
    descripcion: "Descripcion3",
    ruta: "ruta3",
    estado: true,
  },
];

export default tableData;
export type { IBibliotecaData };
