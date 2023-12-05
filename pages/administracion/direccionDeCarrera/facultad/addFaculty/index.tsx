import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { HelperText, Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import {
  checkValidation,
  onlyLettersAndNumbers,
  resetDefaultValFlags,
  validateImg,
} from "utils/functions/validations";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../../../components/alerts";
import { ToastContainer } from "react-toastify";

import { uploadFile } from "../../../../../firebase/config";

import { IAddFaculty } from "utils/interfaces/DireccionDeCarrera/Facultades";
import Link from "next/link";
import { useRouter } from "next/router";
import SectionTitle from "example/components/Typography/SectionTitle";
import URL_API from "../../../../api/apiCareerDirection";

function AddFacultyPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [img, setImg]: any = useState(null);
  const [faculty, setFaculty] = useState<IAddFaculty>({
    titulo: "",
    descripcion: "",
    imagen: "",
  });
const [flags, setFlags] = useState({
  titulo: undefined,
  descripcion: undefined,
  imagen: undefined,
});
const [textErrors, setTextErrors] = useState({
  titulo: "",
  descripcion: "",
  imagen: "",
});

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setFaculty((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };
  const handleChangeDes = (
    e: ChangeEvent<HTMLTextAreaElement>,
    campo: string
  ) => {
    setFaculty((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];

    let valid: any = true;
    let validText = "";

    let imgRes = validateImg(value);

    if (imgRes == 0) {
      valid = undefined;
    } else if (imgRes === 2 || imgRes === 3) {
      valid = false;
    }

    if (imgRes == 1) {
      setImg(value);
    } else {
      clearImg();
    }

    validText =
      imgRes === 1
        ? "Imagen válida"
        : imgRes === 2
        ? "Solo se permite imágenes con tamaño menor a 10MB"
        : imgRes === 3
        ? "Solo se permiten imágenes jpg y png"
        : "";

    setFlags((prev) => ({ ...prev, imagen: valid }));
    setTextErrors((prev) => ({
      ...prev,
      imagen: validText,
    }));
  };

  const uploadFiles = async () => {
    faculty.imagen = "";
    if (img != null) {
      faculty.imagen = await uploadFile(img, "facultades/");
    }
    addFaculty();
  };

  const addFaculty = () => {
    
    if (
      faculty.titulo != null &&
      faculty.descripcion != null &&
      faculty.imagen != null
    ) {
      fetch(`${URL_API.baseUrl}Facultad/Guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: faculty.titulo.toUpperCase(),
          descripcion: faculty.descripcion,
          imagen: faculty.imagen,
        }),
      })
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al registrar los datos");
            router.back();
          } else {
            throw new Error("Error al registrar los datos");
          }
        })
        .catch((e) => {
          console.log(e);
          errorAlert("Error al registrar los datos");
        });
    } else {
      warningAlert("Rellene todos los campos");
    }
  };

  

  const clearImg = () => {
    setImg(null);
    if (inputFileImg.current) {
      inputFileImg.current.value = null;
    }
  };

  const clearValidations = () => {
    setFlags(resetDefaultValFlags(flags, undefined));
    setTextErrors(resetDefaultValFlags(textErrors, ""));
  };

  const clearData = () => {
    setFaculty({
      ...faculty,
      titulo: "",
      descripcion: "",
      imagen: "",
    });
    clearImg();
    clearValidations();
  };

  return (
    <Layout>
      <PageTitle>Agregar Facultad - Dirección de Carrera</PageTitle>
      <SectionTitle>Ingrese todos los campos pedidos.</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Título</span>
          <Input
            value={faculty.titulo}
            className="mt-1"
            maxLength={50}
            placeholder="Escriba título de la facultad"
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>
        <Label className="mt-3">
          <span>Descripción</span>
          <Textarea
            value={faculty.descripcion}
            className="mt-1"
            rows={3}
            placeholder="Escribe la descripción de la facultad."
            onChange={(e) => handleChangeDes(e, "descripcion")}
          />
        </Label>
        
        

        <Label className="mt-4">
          <span className=" text-lg">
            Imagen de referencia para la facultad
          </span>
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
                    alt="Imagen de Ubicación Nueva"
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
            placeholder="Imagen para la facultad"
            accept="image/jpeg, image/png"
            onChange={(e) => handleImageChange(e)}
          />
          {flags.imagen != null && (
            <HelperText valid={flags.imagen}>{textErrors.imagen}</HelperText>
          )}
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={"/administracion/direccionDeCarrera/facultad"}>
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
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AddFacultyPage;
