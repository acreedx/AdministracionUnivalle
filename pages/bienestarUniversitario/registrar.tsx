import React, { useState, ChangeEvent } from "react";
import { ICrearServicios } from "../../utils/interfaces/servicios";
import { Input, Label, HelperText,Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../components/alerts";
import { ToastContainer } from "react-toastify";

function RegistrarServicioPage() {
 const [servicioData, setServicioData] = useState<ICrearServicios>({
    Servicio: {
      nombre: "",
      moduloId: 1,
      imagenUrl: null,
    },
    Ubicacion: {
      Descripcion: null,
      Imagen: null,
      Video: null,
    },
    Requisitos: {
      Descripcion: null,
    },
    Carrera: {
      Nombre: null,
    },
    Referencia: {
      Nombre: null,
      NumeroCel: null,
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setServicioData({
      ...servicioData,
      [campo]: e.target.value,
    });
  };

  const clearData = () => {
    setServicioData({
      ...servicioData,
      Servicio: {
      nombre: "",
      moduloId: 1,
      imagenUrl: null,
    },
    Ubicacion: {
      Descripcion: null,
      Imagen: null,
      Video: null,
    },
    Requisitos: {
      Descripcion: null,
    },
    Carrera: {
      Nombre: null,
    },
    Referencia: {
      Nombre: null,
      NumeroCel: null,
    },
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
        if (response.ok) {
          successAlert("Éxito al registrar los datos");
        } else {
          throw new Error("Error al cambiar los datos del servicio");
        }
      })
      .catch(() => errorAlert("Error al registrar los datos"));
  };

  return (
    <Layout>
      <PageTitle>Registrar servicio - Bienestar Universitario</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            value={servicioData.Servicio.nombre}
            className="mt-1"
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de referencia para el servicio</span>
          <Input
            type="file"
            className="mt-1"
            placeholder="Imagen para el servicio"
            
          />
        </Label>
      </div>
      <SectionTitle>Requisitos</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          <span>Descripción</span>
          <Textarea className="mt-1" rows={3} placeholder="Ingresa los requisitos del servicio." />
        </Label>
      </div>
       <SectionTitle>Carrera</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          <span>Nombre</span>
           <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Escriba el nombre de la carrera."
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>
      </div>
       <SectionTitle>Contactos de referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          <span>Nombre del Contacto</span>
           <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Escriba el nombre de la carrera."
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>
         <Label className="mt-4">
          <span>Número del Contacto</span>
           <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Escriba el nombre de la carrera."
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>
      </div>
      <SectionTitle>Ubicación</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Ubicación</span>
          <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Ingrese la ubicación del servicio"
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de la ubicación del servicio</span>
          <Input
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            
          />
        </Label>
        <Label className="mt-4">
          <span>Video de la ubicación del servicio</span>
          <Input
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            
          />
        </Label>
      </div>
      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Button size="large">Volver</Button>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        <div>
          <Button size="large" onClick={registrarServicio}>
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default RegistrarServicioPage;
