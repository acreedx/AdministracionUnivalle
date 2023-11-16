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
  IAddMaestria,
  IMaestriaData,
  convertJSONMaestria,
  convertJSONListMaestria,
} from "utils/interfaces/PostGrado/MDD";
import Link from "next/link";
import { useRouter } from "next/router";
import SectionTitle from "example/components/Typography/SectionTitle";
import URL from "../../../../api/apiCarrer";

function AgregarMaestriaPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [maestria, setMaestria] = useState<IAddMaestria>({
    titulo: "",
    modalidad: "",
    imagen: "",
  });

  const [maestrias, setMaestrias] = useState<IMaestriaData[]>([]);
  const [selectedMaestria, setSelectedMaestria] = useState("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}/api/Facultad/ListaActivos`)
        .then((res) => res.json())
        .then((res) => setMaestrias(convertJSONListMaestria(res.response)));
    }
    doFetch();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setMaestria((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };
  const handleChangeDes = (e: ChangeEvent<HTMLTextAreaElement>, campo: string) => {
    setMaestria((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };
  
  const addMaestria = () => {
    if (
      maestria.titulo != null &&
      maestria.modalidad != null &&
      maestria.imagen != null
    ) {
      fetch(`${URL.baseUrl}/api/Carrera/Guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: maestria.titulo,
          modalidad: maestria.descripcion,
          imagen: maestria.imagen,
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
    setMaestria({
      ...maestria,
      titulo: "",
      modalidad: "",
      imagen: "",
    });
    setImg(null);
    clearImg();
  };

 

  return (
    <Layout>
      <PageTitle>Agregar Maestria - Postgrado</PageTitle>
      <SectionTitle>Ingrese todos los campos pedidos.</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Título</span>
          <Input
            value={maestria.titulo}
            className="mt-1"
            maxLength={50}
            placeholder="Escriba el título de la maestria."
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>
        <Label className="mt-3">
          <span>Modalidad</span>
          <Textarea
            value={maestria.modalidad}
            className="mt-1"
            rows={3}
            placeholder="Escribe la modalidad de la maestria."
            onChange={(e) => handleChangeDes(e, "modalidad")}
          />
        </Label>
        <Label className="mt-3">
          <span>URL de la imagen</span>
          <Input
            value={maestria.imagen}
            className="mt-1"
            placeholder="Ingrese la URL de la imagen."
            onChange={(e) => handleChange(e, "imagen")}
          />
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={"/administracion/postgradoMaestrias"}>
            <Button size="large">Volver</Button>
          </Link>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        <div>
          <Button size="large" onClick={addMaestria}>
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AgregarMaestriaPage;
