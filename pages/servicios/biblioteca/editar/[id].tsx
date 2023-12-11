import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { HelperText, Input, Label, Textarea } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SweetAlert from "react-bootstrap-sweetalert";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../../components/alerts";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import { ToastContainer } from "react-toastify";
import URL_API from "../../../api/apiLibraryDirection";
import {
  convertJSONBook,
  IAddBook,
  IBookData,
  IApiBookResponse,
} from "utils/interfaces/Biblioteca/Libros";
import { GetServerSidePropsContext } from "next";
import { convertJSONFaculty } from "utils/interfaces/DireccionDeCarrera/Carreras";

interface Props {
  id: number;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  return {
    props: {
      id,
    },
  };
}
function validateImg(file: File | undefined): {
  valid: boolean | undefined;
  validText: string;
} {
  if (!file) {
    return { valid: undefined, validText: "" };
  }

  const allowedExtensions = ["jpg", "jpeg", "png"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const extension = file.name.split(".").pop()?.toLowerCase();
  const isValidExtension = extension && allowedExtensions.includes(extension);
  const isValidSize = file.size <= maxFileSize;

  if (isValidExtension && isValidSize) {
    return { valid: true, validText: "Imagen válida" };
  } else if (!isValidSize) {
    return {
      valid: false,
      validText: "Solo se permite imágenes con tamaño menor a 10MB",
    };
  } else {
    return { valid: false, validText: "Solo se permiten imágenes jpg y png" };
  }
}
function EditBook({ id }: Props) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const inputFileImg: any = useRef(null);
  const [img, setImg]: any = useState<File | null>(null);
  const [book, setBook] = useState<IApiBookResponse>({
    nombreLibro: "",
    nombreAutor: "",
    editorial: "",
    npaginas: 0,
    idioma: "",
    anio: 0,
    descripcion: "",
    ruta: "",
    imagen: null,
  });
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [textErrors, setTextErrors] = useState<Record<string, string>>({});
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];
    const { valid, validText } = validateImg(value || undefined);

    setImg(valid ? value : null);

    setFlags((prev) => ({ ...prev, imagen: valid }));
    setTextErrors((prev) => ({ ...prev, imagen: validText }));
  };
  const uploadFiles = async () => {
    // Resto del código...
    const formData = new FormData();
    formData.append("IdLibro", id.toString());
    formData.append("NombreLibro", book.nombreLibro);
    formData.append("NombreAutor", book.nombreAutor);
    formData.append("Editorial", book.editorial);
    formData.append("Npaginas", book.npaginas.toString());
    formData.append("Idioma", book.idioma);
    formData.append("Anio", book.anio.toString());
    formData.append("Descripcion", book.descripcion);
    if (img) {
      formData.append("Archivo", img);
    } else {
      formData.append("Archivo", "");
    }
    try {
      const response = await fetch(`${URL_API.baseUrl}Libro/Editar`, {
        method: "PUT",
        body: formData,
      });
      console.log("Respuesta de la API:", response);
      if (response.ok) {
        const data = await response.json();
        successAlert("Registro guardado con éxito");
        router.back();
      } else {
        console.error("Detalles del error al editar el libro:", response);
        throw new Error("Error al editar el libro. Respuesta no exitosa.");
      }
    } catch (e) {
      console.error(e);
      errorAlert("Error al Editar el libro");
    }
  };

  // const [nombreLibro, setNombreLibro] = useState("");
  // const [nombreAutor, setNombreAutor] = useState("");
  // const [editorial, setEditorial] = useState("");
  // const [nPaginas, setNPaginas] = useState(0);
  // const [idioma, setIdioma] = useState("");
  // const [anio, setAnio] = useState(0);
  // const [descripcion, setDescripcion] = useState("");
  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${URL_API.baseUrl}Libro/Obtener/${id}`);
        if (!res.ok) {
          throw new Error("Error al obtener datos de la API");
        }
        const data = await res.json();
        const bookData = data.response;
        console.log("Datos de la API:", bookData);
        setBook(bookData);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    }

    fetchData();
  }, []);

  // const handleSubmit = async () => {
  //   if (book.nombreLibro === "" || book.nombreLibro === null) {
  //     setValidationMessage("Debe rellenar el campo de Nombre del libro");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   if (book.nombreAutor === "" || book.nombreAutor === null) {
  //     setValidationMessage("Debe rellenar el campo de Nombre del autor");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   if (book.editorial === "" || book.editorial === null) {
  //     setValidationMessage("Debe rellenar el campo de Editorial");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   if (book.npaginas === 0 || book.npaginas === null) {
  //     setValidationMessage("Debe rellenar el campo de Número de páginas");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   if (book.idioma === "" || book.idioma === null) {
  //     setValidationMessage("Debe rellenar el campo de Idioma");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   if (book.anio === 0 || book.anio === null) {
  //     setValidationMessage("Debe rellenar el campo de Número de páginas");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   if (book.descripcion === "" || book.descripcion === null) {
  //     setValidationMessage("Debe rellenar el campo de Descripción del libro");
  //     setShowAlertValidation(true);
  //     return;
  //   }

  //   // if (img != null) {
  //   //   imagen = await uploadFile(img, "libros/");
  //   // }

  //   try {
  //     const response = await fetch(`${URL_API.baseUrl}Libro/Editar/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(book),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       successAlert("Registro guardado con éxito");
  //       router.back();
  //     } else {
  //       throw new Error(
  //         `Error al editar el libro. Respuesta no exitosa. Detalles: ${JSON.stringify(
  //           response
  //         )}`
  //       );
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     errorAlert(
  //       "Error al editar el libro. Consulte la consola para más detalles."
  //     );
  //   }
  // };

  const handleAlertConfirm = () => {
    uploadFiles();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <PageTitle>Editar Libro</PageTitle>
      <div className="mb-4">
        <Link href={`/servicios/biblioteca`}>
          <Button size="small">
            <span className="mr-2" aria-hidden="true">
              {"←"}
            </span>
            Volver
          </Button>
        </Link>
      </div>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="bookForm" onSubmit={uploadFiles}>
          <Label>
            <span>Nombre del Libro</span>
            {/* <Input
              className="mt-1"
              placeholder="Ingresa el nombre del libro."
              value={nombreLibro}
              maxLength={50}
              onChange={(e) =>
                setBook({ ...book, nombreLibro: e.target.value })
              }
            /> */}
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del libro."
              value={book.nombreLibro}
              maxLength={50}
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  nombreLibro: e.target.value,
                }))
              }
            />
          </Label>
          <Label>
            <span>Nombre del Autor</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del autor."
              value={book.nombreAutor}
              maxLength={50}
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  nombreAutor: e.target.value,
                }))
              }
            />
          </Label>
          <Label className="mt-3">
            <span>Editorial</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre de la editorial."
              value={book.editorial}
              maxLength={50}
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  editorial: e.target.value,
                }))
              }
            />
          </Label>
          <Label className="mt-3">
            <span>Número de Páginas</span>
            <Input
              type="number"
              value={book.npaginas}
              className="mt-1"
              placeholder="Escriba el número de páginas del libro"
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  npaginas: parseInt(e.target.value, 10),
                }))
              }
            />
          </Label>
          <Label className="mt-3">
            <span>Idioma</span>
            <Input
              value={book.idioma}
              className="mt-1"
              maxLength={20}
              placeholder="Escriba el idioma del libro"
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  idioma: e.target.value,
                }))
              }
            />
          </Label>
          <Label className="mt-3">
            <span>Año de Publicación</span>
            <Input
              type="number"
              value={book.anio}
              className="mt-1"
              placeholder="Escriba el año de publicación del libro"
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  anio: parseInt(e.target.value, 10),
                }))
              }
            />
          </Label>
          <Label className="mt-3">
            <span>Descripción</span>
            <Textarea
              value={book.descripcion}
              className="mt-1"
              rows={5}
              placeholder="Ingrese la descripción del libro."
              onChange={(e) =>
                setBook((prevBook) => ({
                  ...prevBook,
                  descripcion: e.target.value,
                }))
              }
            />
          </Label>
          <Label>
            <span className="text-lg">Imagen del Libro</span>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <span>Imagen Actual</span>
                  <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        book.ruta
                          ? book.ruta
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                      }
                      alt="Imagen Actual"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <span>Nueva Imagen</span>
                  <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        img
                          ? URL.createObjectURL(img)
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                      }
                      alt="Imagen Nueva"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Input
              type="file"
              className="mt-1"
              placeholder="Imagen del libro"
              onChange={(e) => setImg(e.target.files?.[0] || null)}
            />
          </Label>

          <Label className="mt-4">
            <div className="relative text-gray-500 focus-within:text-purple-600">
              <input
                className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                disabled
              />
              <button
                type={"button"}
                onClick={() => setShowAlert(true)}
                className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Editar
              </button>
            </div>
          </Label>
        </form>
      </div>
      {showAlert && (
        <SweetAlert
          warning
          title="Atención"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          show={showAlert}
          customButtons={
            <React.Fragment>
              <Button
                onClick={handleAlertConfirm}
                className="mx-2 bg-green-600"
              >
                Confirmar
              </Button>
              <Button onClick={handleAlertCancel} className="mx-2 bg-red-600">
                Cancelar
              </Button>
            </React.Fragment>
          }
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertCancel}
          focusCancelBtn
        >
          ¿Está seguro de que desea actualizar este libro?
        </SweetAlert>
      )}
    </Layout>
  );
}

export default EditBook;
