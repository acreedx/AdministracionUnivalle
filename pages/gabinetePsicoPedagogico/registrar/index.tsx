import React, { useState, ChangeEvent } from "react";
import { ICrearServicios } from "../../../utils/interfaces/servicios";
import {
  Input,
  Label,
  HelperText,
  Textarea,
  Alert,
} from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";
import { ToastContainer } from "react-toastify";
import { uploadFile } from "../../../firebase/config";
function RegistrarServicioPage() {
  const [serviceImg, setImg]: any = useState(null);
  const [ubicacionImg, setUImg]: any = useState(null);
  const [ubicaionVideo, setUVideo]: any = useState(null);

  const [servicioData, setServicioData] = useState<ICrearServicios>({
    nombre: "",
    moduloId: 1,
    imagenUrl: "",
    UbicacionAdd: {
      descripcion: "",
      imagen: "",
      video: "",
      serviciosId: 0,
    },
    RequisitosAdd: {
      descripcion: "",
      serviciosId: 0,
    },
    CarreraAdd: {
      nombre: "",
      serviciosId: 0,
    },
    ReferenciaAdd: {
      nombre: "",
      numeroCel: "",
      serviciosId: 0,
    },
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    campo: string,
    servicio: string
  ) => {
    setServicioData((prevData: any) => ({
      ...prevData,
      [servicio]: {
        ...prevData[servicio],
        [campo]: e.target.value,
      },
    }));
    console.log(servicioData);
  };
  const handleChange1 = (
    e: ChangeEvent<HTMLTextAreaElement>,
    campo: string,
    servicio: string
  ) => {
    setServicioData((prevData: any) => ({
      ...prevData,
      [servicio]: {
        ...prevData[servicio],
        [campo]: e.target.value,
      },
    }));
    console.log(servicioData);
  };
  const handleChange2 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setServicioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    console.log(servicioData);
  };
  const clearData = () => {
    setServicioData({
      ...servicioData,
      nombre: "",
      moduloId: 1,
      imagenUrl: "",
      UbicacionAdd: {
        descripcion: "",
        imagen: "",
        video: "",
        serviciosId: 0,
      },
      RequisitosAdd: {
        descripcion: "",
        serviciosId: 0,
      },
      CarreraAdd: {
        nombre: "",
        serviciosId: 0,
      },
      ReferenciaAdd: {
        nombre: "",
        numeroCel: "",
        serviciosId: 0,
      },
    });
  };

  const registrarServicio = () => {
    console.log(servicioData);
    fetch(
      "http://apisistemaunivalle.somee.com/api/Servicios/addServicioWDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicioData),
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
  };
  const subirArchivos = async () => {
    servicioData.UbicacionAdd.video = null;
    servicioData.UbicacionAdd.imagen = null;
    servicioData.imagenUrl = null;
    if (serviceImg != null) {
      servicioData.imagenUrl = await uploadFile(serviceImg, "servicios/");
    }
    if (ubicacionImg != null) {
      servicioData.UbicacionAdd.imagen = await uploadFile(
        ubicacionImg,
        "ubicaciones/imagenes/"
      );
    }
    if (ubicaionVideo != null) {
      servicioData.UbicacionAdd.video = await uploadFile(
        ubicaionVideo,
        "ubicaciones/videos/"
      );
    }
    servicioData.CarreraAdd.serviciosId = 0;
    servicioData.ReferenciaAdd.serviciosId = 0;
    servicioData.UbicacionAdd.serviciosId = 0;
    servicioData.RequisitosAdd.serviciosId = 0;
    registrarServicio();
  };

  return (
    <Layout>
      <PageTitle>Registrar servicio - Gabinete Psico-Pedagogico</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange2(e, "nombre")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de referencia para el servicio</span>
          <Input
            //value={servicioData.imagenUrl === null ? "" : servicioData.imagenUrl}
            type="file"
            className="mt-1"
            placeholder="Imagen para el servicio"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
          />
        </Label>
      </div>
      <SectionTitle>Requisitos</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Descripción</span>
          <Textarea
            value={
              servicioData.RequisitosAdd.descripcion === null
                ? ""
                : servicioData.RequisitosAdd.descripcion
            }
            className="mt-1"
            rows={3}
            placeholder="Ingresa los requisitos del servicio."
            onChange={(e) => handleChange1(e, "descripcion", "RequisitosAdd")}
          />
        </Label>
      </div>
      <SectionTitle>Carrera</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre</span>
          <Input
            value={
              servicioData.CarreraAdd.nombre === null
                ? ""
                : servicioData.CarreraAdd.nombre
            }
            className="mt-1"
            placeholder="Escriba el nombre de la carrera."
            onChange={(e) => handleChange(e, "nombre", "CarreraAdd")}
          />
        </Label>
      </div>
      <SectionTitle>Contacto de Referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre</span>
          <Input
            value={
              servicioData.ReferenciaAdd.nombre === null
                ? ""
                : servicioData.ReferenciaAdd.nombre
            }
            className="mt-1"
            placeholder="Escriba el nombre del contacto"
            onChange={(e) => handleChange(e, "nombre", "ReferenciaAdd")}
          />
        </Label>
        <Label className="mt-4">
          <span>Numero de Contacto</span>
          <Input
            value={
              servicioData.ReferenciaAdd.numeroCel === null
                ? ""
                : servicioData.ReferenciaAdd.numeroCel
            }
            className="mt-1"
            placeholder="Escriba el número de celular del contacto"
            onChange={(e) => handleChange(e, "numeroCel", "ReferenciaAdd")}
          />
        </Label>
      </div>
      <SectionTitle>Ubicación</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Ubicación</span>
          <Input
            value={
              servicioData.UbicacionAdd.descripcion === null
                ? ""
                : servicioData.UbicacionAdd.descripcion
            }
            className="mt-1"
            placeholder="Ingrese la ubicación del servicio"
            onChange={(e) => handleChange(e, "descripcion", "UbicacionAdd")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de la ubicación del servicio</span>
          <Input
            //value={servicioData.Ubicacion.imagen === null ? "" : servicioData.Ubicacion.imagen}
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            onChange={(e) => setUImg(e.target.files?.[0] || null)}
          />
        </Label>
        <Label className="mt-4">
          <span>Video de la ubicación del servicio</span>
          <Input
            //value={servicioData.Ubicacion.video === null ? "" : servicioData.Ubicacion.video}
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            onChange={(e) => setUVideo(e.target.files?.[0] || null)}
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
          <Button size="large" onClick={subirArchivos}>
            Registrar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default RegistrarServicioPage;
