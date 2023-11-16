import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import { ToastContainer } from "react-toastify";

import {
  IAddDiplomado,
  IDiplomadoData,
  convertJSONDiplomado,
  convertJSONListDiplomado,
} from "utils/interfaces/PostGrado/MDD";
import Link from "next/link";
import { useRouter } from "next/router";
import SectionTitle from "example/components/Typography/SectionTitle";
import URL from "utils/demo/api";
import { errorAlert, successAlert, warningAlert } from "components/alerts";

function AgregarDiplomadoPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [diplomado, setDiplomado] = useState<IAddDiplomado>({
    titulo: "",
    modalidad: "",
    imagen: "",
  });

  const [diplomados, setDiplomados] = useState<IDiplomadoData[]>([]);
  const [selectedDiplomado, setSelectedDiplomado] = useState("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}/api/Facultad/ListaActivos`)
        .then((res) => res.json())
        .then((res) => setDiplomados(convertJSONListDiplomado(res.response)));
    }
    doFetch();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setDiplomado((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };
  const handleChangeDes = (
    e: ChangeEvent<HTMLTextAreaElement>,
    campo: string
  ) => {
    setDiplomado((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };

  const addDoctorado = () => {
    if (
      diplomado.titulo != null &&
      diplomado.modalidad != null &&
      diplomado.imagen != null
    ) {
      fetch(`${URL.baseUrl}/api/Carrera/Guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: diplomado.titulo,
          modalidad: diplomado.modalidad,
          imagen: diplomado.imagen,
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
    setDiplomado({
      ...diplomado,
      titulo: "",
      modalidad: "",
      imagen: "",
    });
    setImg(null);
    clearImg();
  };

  return (
    <Layout>
      <PageTitle>Agregar Diplomado - Postgrado</PageTitle>
      <SectionTitle>Ingrese todos los campos pedidos.</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Título</span>
          <Input
            value={diplomado.titulo}
            className="mt-1"
            maxLength={50}
            placeholder="Escriba el título del diplomado."
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>
        <Label className="mt-3">
          <span>Modalidad</span>
          <Textarea
            value={diplomado.modalidad}
            className="mt-1"
            rows={3}
            placeholder="Escribe la modalidad del diplomado."
            onChange={(e) => handleChangeDes(e, "modalidad")}
          />
        </Label>
        <Label className="mt-3">
          <span>URL de la imagen</span>
          <Input
            value={diplomado.imagen}
            className="mt-1"
            placeholder="Ingrese la URL de la imagen."
            onChange={(e) => handleChange(e, "imagen")}
          />
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={"/administracion/postgradoDiplomados"}>
            <Button size="large">Volver</Button>
          </Link>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        <div>
          <Button size="large" onClick={addDoctorado}>
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AgregarDiplomadoPage;
