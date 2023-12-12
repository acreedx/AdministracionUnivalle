// Interfaces
export interface IBook {
  id: number;
  nombreLibro: string;
  nombreAutor: string;
  editorial: string;
  npaginas: number;
  idioma: string;
  anio: number;
  descripcion: string;
  ruta: string;
}

export interface IBookData {
  id: number;
  nombreLibro: string;
  nombreAutor: string;
  editorial: string;
  npaginas: number;
  idioma: string;
  anio: number;
  descripcion: string;
  ruta: string;
}

export interface IAddBook {
  nombreLibro: string;
  nombreAutor: string;
  editorial: string;
  npaginas: number;
  idioma: string;
  anio: number;
  descripcion: string;
  imagen: File | null; // Cambiamos el tipo a File
}

export interface IApiBookResponse extends IAddBook {
  ruta: string;
}
// Functions to convert JSON data
function convertJSONBook(data: any): IBookData {
  const convertedData: IBookData = {
    id: data.id,
    nombreLibro: data.nombreLibro,
    nombreAutor: data.nombreAutor,
    editorial: data.editorial,
    npaginas: data.npaginas,
    idioma: data.idioma,
    anio: data.anio,
    descripcion: data.descripcion,
    ruta: data.ruta,
  };
  return convertedData;
}

// Functions for adding a new book
// function addBook(objLibro: IAddBook, archivo: File | null): Promise<any> {
//   const formData = new FormData();
//   formData.append("nombreLibro", objLibro.nombreLibro);
//   formData.append("nombreAutor", objLibro.nombreAutor);
//   formData.append("editorial", objLibro.editorial);
//   formData.append("npaginas", objLibro.npaginas.toString());
//   formData.append("idioma", objLibro.idioma);
//   formData.append("anio", objLibro.anio.toString());
//   formData.append("descripcion", objLibro.descripcion);

//   if (archivo) {
//     formData.append("Archivo", archivo);
//   }

//   return fetch("http://apisistemaunivalle.somee.com/api/Libros/Registrar", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error("Error al registrar los datos");
//       }
//     })
//     .then((data) => {
//       return data;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       throw new Error("Error al registrar los datos");
//     });
//}

export { convertJSONBook };
