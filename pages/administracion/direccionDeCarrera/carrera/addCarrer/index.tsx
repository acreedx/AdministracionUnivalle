import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
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
import URL from "../../../../api/apiCarrer";

function AgregarcarrerPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [carrer, setCarrer] = useState<IAddCarrer>({
    titulo: "",
    descripcion: "",
    tituloOtorgado: "",
    duracion: 0,
    planDeEstudios: "",
    imagen: "",
    facultadId: 0
  });

  const [faculties, setFaculties] = useState<IFacultiesData[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}/api/Facultad/ListaActivos`)
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
  const handleChangeDes = (e: ChangeEvent<HTMLTextAreaElement>, campo: string) => {
    setCarrer((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
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
      fetch(`${URL.baseUrl}/api/Carrera/Guardar`, {
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
        <Label className="mt-3">
          <span>URL de la imagen</span>
          <Input
            value={carrer.imagen}
            className="mt-1"
            placeholder="Ingrese la URL de la imagen."
            onChange={(e) => handleChange(e, "imagen")}
          />
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
          <Button size="large" onClick={addCarrer}>
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AgregarcarrerPage;
