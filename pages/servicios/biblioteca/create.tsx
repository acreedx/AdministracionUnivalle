import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import {
  HelperText,
  Input,
  Label,
  Select,
  Textarea,
} from "@roketid/windmill-react-ui";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

import { IAddBook } from "utils/interfaces/Biblioteca/Libros";
import Link from "next/link";
import SectionTitle from "example/components/Typography/SectionTitle";
import URL_API from "../../api/apiLibraryDirection";
// import URL from "../../api/apiLibraryDirection";

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
function AddBookPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [img, setImg]: any = useState<File | null | undefined>(null);
  const [book, setBook] = useState<IAddBook>({
    nombreLibro: "",
    nombreAutor: "",
    editorial: "",
    npaginas: 0,
    idioma: "",
    anio: 0,
    descripcion: "",
    imagen: null,
  });
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [textErrors, setTextErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Puedes agregar lógica adicional al cargar la página
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    campo: string
  ) => {
    setBook((prevData) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];
    const { valid, validText } = validateImg(value || undefined);

    setImg(valid ? value : null);

    setFlags((prev) => ({ ...prev, imagen: valid }));
    setTextErrors((prev) => ({ ...prev, imagen: validText }));
  };

  const uploadFiles = async () => {
    if (img) {
      const formData = new FormData();
      formData.append("Imagen", img);
      formData.append("NombreLibro", book.nombreLibro);
      formData.append("NombreAutor", book.nombreAutor);
      formData.append("Editorial", book.editorial);
      formData.append("Npaginas", book.npaginas.toString());
      formData.append("Idioma", book.idioma);
      formData.append("Anio", book.anio.toString());
      formData.append("Descripcion", book.descripcion);

      try {
        const response = await fetch(`${URL_API.baseUrl}Libro/CrearLibro`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          successAlert("Registro guardado con éxito");
          router.back();
        } else {
          throw new Error("Error al crear el libro");
        }
      } catch (e) {
        console.error(e);
        errorAlert("Error al crear el libro");
      }
    } else {
      warningAlert("Seleccione una imagen para el libro");
    }
  };

  const addBook = async () => {
    const requiredFields = [
      "nombreLibro",
      "nombreAutor",
      "editorial",
      "npaginas",
      "idioma",
      "anio",
      "descripcion",
    ];

    if (
      book.nombreLibro !== null &&
      book.nombreAutor !== null &&
      book.editorial !== null &&
      book.npaginas !== null &&
      book.idioma !== null &&
      book.anio !== null &&
      book.descripcion !== null
    ) {
      const formData = new FormData();
      formData.append("nombreLibro", book.nombreLibro);
      formData.append("nombreAutor", book.nombreAutor);
      formData.append("editorial", book.editorial);
      formData.append("npaginas", book.npaginas.toString());
      formData.append("idioma", book.idioma);
      formData.append("anio", book.anio.toString());
      formData.append("descripcion", book.descripcion);

      if (img) {
        formData.append("Archivo", img);
      }

      try {
        const response = await fetch(`${URL_API.baseUrl}Libro/Registrar`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          successAlert(data.mensaje);
          router.back();
        } else {
          throw new Error("Error al registrar los datos");
        }
      } catch (e) {
        console.error(e);
        errorAlert("Error al registrar los datos");
      }
    } else {
      warningAlert("Rellene todos los campos");
    }
  };

  const clearValidations = () => {
    setFlags({});
    setTextErrors({});
  };

  const clearImg = () => {
    if (inputFileImg.current) {
      inputFileImg.current.value = null;
    }
  };

  const clearData = () => {
    setBook({
      ...book,
      nombreLibro: "",
      nombreAutor: "",
      editorial: "",
      npaginas: 0,
      idioma: "",
      anio: 0,
      descripcion: "",
    });
    setImg(null);
    clearImg();
    clearValidations();
  };

  return (
    <Layout>
      <PageTitle>Agregar Libro</PageTitle>
      <SectionTitle>Ingrese todos los campos pedidos.</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Formulario de registro de libro */}
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <Label>
            <span>Nombre del Libro</span>
            <Input
              value={book.nombreLibro}
              className="mt-1"
              maxLength={50}
              placeholder="Escriba el nombre del libro"
              onChange={(e) => handleChange(e, "nombreLibro")}
            />
          </Label>
          <Label>
            <span>Nombre del Autor</span>
            <Input
              value={book.nombreAutor}
              className="mt-1"
              maxLength={50}
              placeholder="Escriba el nombre del autor"
              onChange={(e) => handleChange(e, "nombreAutor")}
            />
          </Label>
          {/* Agrega más campos según sea necesario */}
          <Label className="mt-3">
            <span>Editorial</span>
            <Input
              value={book.editorial}
              className="mt-1"
              maxLength={50}
              placeholder="Escriba la editorial del libro"
              onChange={(e) => handleChange(e, "editorial")}
            />
          </Label>
          <Label className="mt-3">
            <span>Número de Páginas</span>
            <Input
              type="number"
              value={book.npaginas}
              className="mt-1"
              placeholder="Escriba el número de páginas del libro"
              onChange={(e) => handleChange(e, "npaginas")}
            />
          </Label>
          <Label className="mt-3">
            <span>Idioma</span>
            <Input
              value={book.idioma}
              className="mt-1"
              maxLength={20}
              placeholder="Escriba el idioma del libro"
              onChange={(e) => handleChange(e, "idioma")}
            />
          </Label>
          <Label className="mt-3">
            <span>Año de Publicación</span>
            <Input
              type="number"
              value={book.anio}
              className="mt-1"
              placeholder="Escriba el año de publicación del libro"
              onChange={(e) => handleChange(e, "anio")}
            />
          </Label>
          <Label className="mt-3">
            <span>Descripción</span>
            <Textarea
              value={book.descripcion}
              className="mt-1"
              rows={3}
              placeholder="Escribe la descripción del libro."
              onChange={(e) => handleChange(e, "descripcion")}
            />
          </Label>
          <Label className="mt-4">
            <span>Imagen del Libro</span>
            <div className="text-center mb-5">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <span>Imagen</span>
                  <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        img === null
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                          : URL.createObjectURL(img)
                      }
                      alt="Imagen nueva"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Input
              ref={inputFileImg}
              valid={flags.imagen}
              type="file"
              className="mt-1"
              placeholder="Imagen para el libro"
              accept="image/jpeg, image/png"
              onChange={(e) => handleImageChange(e)}
            />
            {flags.imagen != null && (
              <HelperText valid={flags.imagen}>{textErrors.imagen}</HelperText>
            )}
          </Label>
        </div>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={"/ruta_de_vuelta"}>
            <Button size="large">Volver</Button>
          </Link>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        <div>
          <Button size="large" onClick={uploadFiles}>
            Registrar Libro
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AddBookPage;
