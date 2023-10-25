import React, { useState, useRef, ChangeEvent } from "react";
import { Input, Label } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";
import { ToastContainer } from "react-toastify";
import { uploadFile } from "../../../firebase/config";
import { IObjetosPerdidos } from "utils/interfaces/ObjetosPerdidos";
import Link from "next/link";

function AgregarObjPerdidoPage() {
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [objPerdido, setObjPerdido] = useState<IObjetosPerdidos>({
    titulo: "",
    archivo: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setObjPerdido((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  };

  const registrarObjPer = () => {
    if (objPerdido.titulo != null && objPerdido.archivo != null) {
      fetch(
        "http://apisistemaunivalle.somee.com/api/Servicios/addServicioWDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(objPerdido),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al registrar los datos");
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Error al registrar los datos"));
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
    setObjPerdido({
      ...objPerdido,
      titulo: "",
      archivo: "",
    });
    setImg(null);
    clearImg();
  };

  const subirArchivos = async () => {
    objPerdido.archivo = "";
    if (objPerImg != null) {
      objPerdido.archivo = await uploadFile(objPerImg, "objetosPerdidos/");
    }
    registrarObjPer();
  };

  return (
    <Layout>
      <PageTitle>Agregar Objeto Perdido - Bienestar Universitario</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre o descripción del objeto perdido</span>
          <Input
            value={objPerdido.titulo}
            className="mt-1"
            maxLength={50}
            placeholder="Escriba aquí el nombre o la descripción de la imagen"
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen del objeto perdido</span>
          <Input
            type="file"
            ref={inputFileImg}
            accept="image/png, image/jpeg"
            className="mt-1"
            placeholder="Imagen para el servicio"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
          />
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={"/bienestarUniversitario/listarObjPerdidos"}>
            <Button size="large">Volver</Button>
          </Link>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        <div>
          <Button size="large" onClick={subirArchivos}>
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AgregarObjPerdidoPage;
