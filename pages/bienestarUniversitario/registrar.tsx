import React, { useState, ChangeEvent } from "react";
import { ICrearServicios } from "../../utils/interfaces/servicios";
import { Input, Label } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";

import Layout from "example/containers/Layout";

function RegistrarServicioPage() {
  const [servicioData, setServicioData] = useState<ICrearServicios>({
    nombre: "",
    moduloId: 1,
    imagenUrl: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setServicioData({
      ...servicioData,
      [campo]: e.target.value,
    });
  };

  const registrarServicio = () => {
    fetch("http://apisistemaunivalle.somee.com/api/Servicios/addServicio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(servicioData),
    })
      .then((response) => {
        console.log(response);
      })
      .catch(() => alert("Ocurrio un error al registrar los datos"));
  };

  return (
    <Layout>
      <PageTitle>Registrar servicio - Bienestar Universitario</PageTitle>
      <SectionTitle>Rellene los siguientes campos</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            className="mt-1"
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>

        <Label className="mt-4">
          <span>Url de la imagen de referencia del servicio</span>
          <Input
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
          <Button size="large">Limpiar campos</Button>
        </div>

        <div>
          <Button size="large" onClick={registrarServicio}>
            Registrar
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default RegistrarServicioPage;
