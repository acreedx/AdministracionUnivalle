import React, { useState, useRef, ChangeEvent, useEffect } from "react";
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
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function AgregarObjPerdidoPage() {
  const router = useRouter();
  const { id } = router.query;
  const numId = parseInt(id as string, 10);
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [objPerData, setObjPerData] = useState<IObjetosPerdidos>({
    titulo: "",
    archivo: "",
  });
  const [objPerBkData, setObjPerBkData] = useState<IObjetosPerdidos>({
    titulo: "",
    archivo: "",
  });

  async function cargarDatosObj(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setObjPerData({
        titulo: resData.data.nombre,
        archivo: resData.data.imagenUrl,
      });
      setObjPerBkData({
        titulo: resData.data.nombre,
        archivo: resData.data.imagenUrl,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setObjPerData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    console.log(objPerData);
  };

  const editarServicio = async (id: number) => {
    if (
      objPerData.titulo !== objPerBkData.titulo ||
      objPerData.archivo !== objPerBkData.archivo
    ) {
      if (objPerData.archivo != null) {
        objPerData.archivo = await uploadFile(objPerImg, "objetosPerdidos/");
      }
      fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/updateServicio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(objPerData),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
    } else {
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
  };

  const clearImg = () => {
    if (inputFileImg.current) {
      inputFileImg.current.value = objPerBkData.archivo;
    }
  };

  const clearData = () => {
    setObjPerData(objPerBkData);
    setImg(objPerImg);
    clearImg();
  };

  useEffect(() => {
    cargarDatosObj(numId);
  }, []);

  return (
    <Layout>
      <PageTitle>Editar Objeto Perdido - Bienestar Universitario</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre o descripción del objeto perdido</span>
          <Input
            value={objPerData.titulo}
            className="mt-1"
            placeholder="Escriba aquí el nombre o la descripción de la imagen"
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen del objeto perdido</span>
          <Input
            type="file"
            ref={inputFileImg}
            accept="image/*"
            className="mt-1"
            placeholder="Imagen para el servicio"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
          />
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Button size="large">
            <Link href={"/bienestarUniversitario/listarObjPerdidos"}>
              Volver
            </Link>
          </Button>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        <div>
          <Button size="large" onClick={() => editarServicio(numId)}>
            Editar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AgregarObjPerdidoPage;
