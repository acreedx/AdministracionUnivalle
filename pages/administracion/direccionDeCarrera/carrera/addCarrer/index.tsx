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

import {
  IAddCarrer,
  IFacultiesData,
  convertJSONFaculty,
  convertJSONListFaculty,
} from "utils/interfaces/DireccionDeCarrera/Carreras";
import Link from "next/link";
import { useRouter } from "next/router";
import SectionTitle from "example/components/Typography/SectionTitle";
import URL_API from "../../../../api/apiCareerDirection";

function AddCarrerPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [img, setImg]: any = useState(null);
  const [carrer, setCarrer] = useState<IAddCarrer>({
    titulo: "",
    descripcion: "",
    tituloOtorgado: "",
    duracion: 0,
    planDeEstudios: "",
    imagen: "",
    facultadId: 0,
  });
  const [flags, setFlags] = useState({
    titulo: undefined,
    descripcion: undefined,
    tituloOtorgado: undefined,
    duracion: undefined,
    planDeEstudios: undefined,
    imagen: undefined,
    facultadId: undefined,
  });
  const [textErrors, setTextErrors] = useState({
    titulo: "",
    descripcion: "",
    tituloOtorgado: "",
    duracion: 0,
    planDeEstudios: "",
    imagen: "",
    facultadId: 0,
  });

  const [faculties, setFaculties] = useState<IFacultiesData[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL_API.baseUrl}Facultad/ListaActivos`)
        .then((res) => res.json())
        .then((res) => setFaculties(convertJSONListFaculty(res.response)));
    }
    doFetch();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setCarrer((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };
  const handleChangeDes = (
    e: ChangeEvent<HTMLTextAreaElement>,
    campo: string
  ) => {
    setCarrer((prevData: any) => ({
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
    carrer.imagen = "";
    if (img != null) {
      carrer.imagen = await uploadFile(img, "carreras/");
    }
    addCarrer();
  };

  const addCarrer = () => {
    if (
      carrer.titulo != null &&
      carrer.descripcion != null &&
      carrer.tituloOtorgado != null &&
      carrer.duracion != null &&
      carrer.planDeEstudios != null &&
      carrer.imagen != null
    ) {
      fetch(`${URL_API.baseUrl}Carrera/Guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: carrer.titulo,
          descripcion: carrer.descripcion,
          tituloOtorgado: carrer.tituloOtorgado,
          duracion: carrer.duracion,
          planDeEstudios: carrer.planDeEstudios,
          imagen: carrer.imagen,
          facultadId: selectedFaculty,
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
  const clearValidations = () => {
    setFlags(resetDefaultValFlags(flags, undefined));
    setTextErrors(resetDefaultValFlags(textErrors, ""));
  };

  const clearImg = () => {
    if (inputFileImg.current) {
      inputFileImg.current.value = null;
    }
  };

  const clearData = () => {
    setCarrer({
      ...carrer,
      titulo: "",
      descripcion: "",
      tituloOtorgado: "",
      duracion: 0,
      planDeEstudios: "",
      imagen: "",
    });
    setImg(null);
    clearImg();
    clearValidations();
  };

  return (
    <Layout>
      <PageTitle>Agregar Carrera - Dirección de Carrera</PageTitle>
      <SectionTitle>Ingrese todos los campos pedidos.</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Título</span>
          <Input
            value={carrer.titulo}
            className="mt-1"
            maxLength={50}
            placeholder="Escriba título de la carrera"
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>
        <Label className="mt-3">
          <span>Descripción</span>
          <Textarea
            value={carrer.descripcion}
            className="mt-1"
            rows={3}
            placeholder="Escribe la descripción de la carrera."
            onChange={(e) => handleChangeDes(e, "descripcion")}
          />
        </Label>
        <Label className="mt-3">
          <span>Título Otorgado</span>
          <Input
            value={carrer.tituloOtorgado}
            className="mt-1"
            maxLength={50}
            placeholder="Escriba título que otorga la carrera"
            onChange={(e) => handleChange(e, "tituloOtorgado")}
          />
        </Label>
        <Label className="mt-3">
          <span>Duración</span>
          <Input
            type="number"
            value={carrer.duracion}
            maxLength={1}
            className="mt-1"
            placeholder="Escriba la duración de la carrera"
            onChange={(e) => handleChange(e, "duracion")}
          />
        </Label>
        <Label className="mt-3">
          <span>Plan de Estudios</span>
          <Input
            value={carrer.planDeEstudios}
            className="mt-1"
            placeholder="Ingrese la URL del pdf con el plan de estudios."
            onChange={(e) => handleChange(e, "planDeEstudios")}
          />
        </Label>
        <Label className="mt-4">
          <span className=" text-lg">
            Imagen de referencia para la carrera
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
            placeholder="Imagen para la carrera"
            accept="image/jpeg, image/png"
            onChange={(e) => handleImageChange(e)}
          />
          {flags.imagen != null && (
            <HelperText valid={flags.imagen}>{textErrors.imagen}</HelperText>
          )}
        </Label>
        <Label className="mt-4">
          <span>Seleccione una Facultad</span>
          <Select
            className="mt-1"
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            {faculties.map((facultad, i) => (
              <option key={facultad.id} value={facultad.id}>
                {facultad.titulo}
              </option>
            ))}
          </Select>
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={"/administracion/direccionDeCarrera/carrera"}>
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

export default AddCarrerPage;
