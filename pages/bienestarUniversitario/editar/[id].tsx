import React, { useState, ChangeEvent, useEffect } from "react";
import { IEditarServicio } from "../../../utils/interfaces/servicios";
import { Input, Label } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import { useRouter } from "next/router";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";
import { ToastContainer } from "react-toastify";

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function EditarServicioPage() {
  const [servicioData, setServicioData] = useState<IEditarServicio>({
    nombre: "",
    imagenUrl: null,
  });
  const [servicioBkData, setServicioBkData] = useState<IEditarServicio>({
    nombre: "",
    imagenUrl: null,
  });

  const router = useRouter();
  const { id } = router.query;
  const numId = parseInt(id as string, 10);

  async function cargarDatosServicio(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setServicioBkData({
        nombre: resData.data.nombre,
        imagenUrl: resData.data.imagenUrl,
      });
      setServicioData({
        nombre: resData.data.nombre,
        imagenUrl: resData.data.imagenUrl,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }

  useEffect(() => {
    cargarDatosServicio(numId);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setServicioData({
      ...servicioData,
      [campo]: e.target.value,
    });
  };

  const clearData = () => {
    setServicioData(servicioBkData);
  };

  const editarServicio = (id: number) => {
    if (
      servicioData.nombre !== servicioBkData.nombre ||
      servicioData.imagenUrl !== servicioBkData.imagenUrl
    ) {
      fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/updateServicio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
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

  return (
    <Layout>
      <PageTitle>Editar datos del servicio - Bienestar Universitario</PageTitle>
      <SectionTitle>Cambie los campos que desee</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>

        <Label className="mt-4">
          <span>Url de la imagen de referencia del servicio</span>
          <Input
            value={servicioData.imagenUrl || ""}
            className="mt-1"
            placeholder="Escriba aquí la url de la imagen"
            onChange={(e) => handleChange(e, "imagenUrl")}
          />
        </Label>
      </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Button size="large">Volver</Button>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Reestablecer datos
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

export default EditarServicioPage;
