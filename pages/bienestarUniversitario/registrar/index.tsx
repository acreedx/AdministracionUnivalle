import React, { useState, ChangeEvent } from "react";
import { ICrearServicio } from "../../../utils/interfaces/servicios";
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

import { uploadFile } from "../../../firebase/config";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";



function RegistrarServicioPageModal() {
  const [serviceImg, setImg]: any = useState(null);

  const router = useRouter(); 
  const [servicioData, setServicioData] = useState<ICrearServicio>({
    nombre: "",
    moduloId: 1,
    imagenUrl: null
  });
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
      imagenUrl: null
    });
  };

  const registrarServicio = () => {
    
    fetch(
      "http://apisistemaunivalle.somee.com/api/Servicios/addServicio",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicioData),
      }
    )
      .then(async (response) => {
        if (response.ok) {
          const res:any= await response.json();
          successAlert("Éxito al registrar los datos");
           setTimeout(() => {
            router.push(`/bienestarUniversitario/editar/${res.data.id}`);
        }, 2000);
        } else {
          throw new Error("Error al cambiar los datos del servicio");
        }
      })
      .catch(() => errorAlert("Error al registrar los datos"));
  };

  const subirArchivos = async () => {
    servicioData.imagenUrl = null;
    if (serviceImg != null) {
      servicioData.imagenUrl = await uploadFile(serviceImg, "servicios/");
    }
    registrarServicio();
  };

  return (
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <PageTitle>Registrar servicio - Bienestar Universitario</PageTitle>
        <SectionTitle>Datos Generales*</SectionTitle>

        <div >
          <Label>
            <span className="text-lg">Nombre del servicio</span>
            <Input
              value={servicioData.nombre}
              className="mt-1"
              placeholder="Escriba aquí el nombre del servicio"
              onChange={(e) => handleChange2(e, "nombre")}
            />
          </Label>

          <Label className="mt-4">
            <span className=" text-lg">Imagen de referencia para el servicio</span>
             <div className="text-center mb-5">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <span>Imagen</span>
                  <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                   <img
                      className="w-full h-full object-cover"
                      src={serviceImg === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : URL.createObjectURL(serviceImg)}
                      alt="Imagen de Ubicación Nueva"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Input
              type="file"
              className="mt-1"
              placeholder="Imagen para el servicio"
              onChange={(e) => setImg(e.target.files?.[0] || null)}
            />
          </Label>
        </div>
        <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">

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
        <ToastContainer/>
      </div>
  );
}

export default RegistrarServicioPageModal;