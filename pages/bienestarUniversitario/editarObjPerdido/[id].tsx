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
import Image from "next/image";
import { isValidUrl } from "utils/functions/url";

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
        `http://apisistemaunivalle.somee.com/api/Publicaciones/GetPublicacionByID/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setObjPerData({
        titulo: resData.data.titulo,
        archivo: resData.data.archivo,
      });
      setObjPerBkData({
        titulo: resData.data.titulo,
        archivo: resData.data.archivo,
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

  const editarObjPer = async (id: number) => {
    if (objPerData.titulo !== objPerBkData.titulo || objPerImg != null) {
      if (objPerData.archivo != null) {
        objPerData.archivo = await uploadFile(objPerImg, "objetosPerdidos/");
        fetch(
          `http://apisistemaunivalle.somee.com/api/Publicaciones/UpdatePublicaciones/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              archivo: objPerData.archivo,
              titulo: objPerData.titulo,
              serviciosId: 1,
            }),
          }
        )
          .then((response) => {
            if (response.ok) {
              successAlert("Éxito al editar los datos");
            } else {
              throw new Error();
            }
          })
          .catch(() => errorAlert("Error al cambiar los datos del servicio"));
      } else {
        warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
      }
    } else {
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
  };

  const clearImg = () => {
    if (inputFileImg.current) {
      inputFileImg.current.value = null;
    }
  };

  const clearData = () => {
    setObjPerData(objPerBkData);
    setImg(null);
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
            maxLength={50}
            placeholder="Escriba aquí el nombre o la descripción de la imagen"
            onChange={(e) => handleChange(e, "titulo")}
          />
        </Label>

        <div className="flex flex-row flex-wrap justify-around mt-4">
          <div className="w-1/4 text-center">
            {isValidUrl(objPerBkData.archivo) && (
              <>
                <span className="text-center">Imagen del objeto perdido</span>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                  }}
                >
                  <Image src={objPerBkData.archivo} layout="fill" />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <Label>
              <Input
                type="file"
                ref={inputFileImg}
                accept="image/png, image/jpeg"
                className="mt-1"
                placeholder="Imagen del objeto perdido"
                onChange={(e) => setImg(e.target.files?.[0] || null)}
              />
            </Label>
          </div>
        </div>
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
          <Button size="large" onClick={() => editarObjPer(numId)}>
            Editar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AgregarObjPerdidoPage;
