import React, { useState, ChangeEvent } from "react";
import { ICrearServicios } from "../../utils/interfaces/servicios";
import { Input, Label, HelperText,Textarea, Alert } from "@roketid/windmill-react-ui";
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
import {uploadFile} from "../../firebase/config"
function RegistrarServicioPage() {

  const [serviceImg,setImg]:any = useState(null)
  const [ubicacionImg,setUImg]:any = useState(null)
  const [ubicaionVideo,setUVideo]:any = useState(null)

  const [servicioData, setServicioData] = useState<ICrearServicios>({
    Servicio: {
      nombre: "",
      moduloId: 1,
      imagenUrl: null,
    },
    Ubicacion: {
      descripcion: null,
      imagen: null,
      video: null,
    },
    Requisitos: {
      descripcion: null,
    },
    Carrera: {
      nombre: null,
    },
    Referencia: {
      nombre: null,
      numeroCel: null,
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string, servicio:string) => {
    setServicioData({
      ...servicioData,
      [servicio]:{
        [campo]:e.target.value
      }
    });
  };
  const handleChange1 = (e: ChangeEvent<HTMLTextAreaElement>, campo: string, servicio:string) => {
    setServicioData({
      ...servicioData,
      [servicio]:{
        [campo]:e.target.value
      }
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
        descripcion: "",
        imagen: null,
        video: null,
      },
      Requisitos: {
        descripcion: "",
      },
      Carrera: {
        nombre: "",
      },
      Referencia: {
        nombre: "",
        numeroCel: "",
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
const subirArchivos = async () =>{
    servicioData.Ubicacion.video =  null;
    servicioData.Ubicacion.imagen = null;
    servicioData.Servicio.imagenUrl= null;
    if(serviceImg!=null)
    {
      servicioData.Servicio.imagenUrl= await uploadFile(serviceImg,"servicios/");
    } 
    if(ubicacionImg!=null){
      servicioData.Ubicacion.imagen = await uploadFile(ubicacionImg,"ubicaciones/imagenes/");

    }
    if(ubicaionVideo!=null){
     servicioData.Ubicacion.video = await uploadFile(ubicaionVideo,"ubicaciones/videos/");
    }
    //registrarServicio();
  }

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
            onChange={(e) => handleChange(e, "nombre","Servicio")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de referencia para el servicio</span>
          <Input
            value={servicioData.Servicio.imagenUrl === null ? "" : servicioData.Servicio.imagenUrl}
            type="file"
            className="mt-1"
            placeholder="Imagen para el servicio"
            onChange={e => setImg(e.target.files?.[0] || null)}
          />
        </Label>
      </div>
      <SectionTitle>Requisitos</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label >
          <span>Descripción</span>
          <Textarea 
          value={servicioData.Requisitos.descripcion === null ? "" : servicioData.Requisitos.descripcion}
          className="mt-1" 
          rows={3} 
          placeholder="Ingresa los requisitos del servicio." 
          onChange={(e) => handleChange1(e, "descripcion","Requisitos")}
          />
        </Label>
      </div>
       <SectionTitle>Carrera</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre</span>
           <Input
            value={servicioData.Carrera.nombre === null ? "" : servicioData.Carrera.nombre}
            className="mt-1"
            placeholder="Escriba el nombre de la carrera."
            onChange={(e) => console.log(handleChange(e, "nombre","Carrera"))}
          />
        </Label>
      </div>
       <SectionTitle>Contactos de referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del Contacto</span>
           <Input
            value={servicioData.Referencia.nombre === null ? "" : servicioData.Referencia.nombre}
            className="mt-1"
            placeholder="Escriba el nombre del contacto."
            onChange={(e) => handleChange(e, "nombre","Referencia")}
          />
        </Label>
         <Label className="mt-4">
          <span>Número del Contacto</span>
           <Input
            value={servicioData.Referencia.numeroCel === null ? "" : servicioData.Referencia.numeroCel}
            className="mt-1"
            placeholder="Escriba el numero del contacto."
            onChange={(e) => handleChange(e, "numeroCel","Referencia")}
          />
        </Label>
      </div>
      <SectionTitle>Ubicación</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Ubicación</span>
          <Input
            value={servicioData.Ubicacion.descripcion === null ? "" : servicioData.Ubicacion.descripcion}
            className="mt-1"
            placeholder="Ingrese la ubicación del servicio"
            onChange={(e) => handleChange(e, "descripcion","Ubicacion")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de la ubicación del servicio</span>
          <Input
            value={servicioData.Ubicacion.imagen === null ? "" : servicioData.Ubicacion.imagen}
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            onChange={e => setUImg(e.target.files?.[0] || null)}
          />
        </Label>
        <Label className="mt-4">
          <span>Video de la ubicación del servicio</span>
          <Input
            value={servicioData.Ubicacion.video === null ? "" : servicioData.Ubicacion.video}
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            onChange={e => setUVideo(e.target.files?.[0] || null)}
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
