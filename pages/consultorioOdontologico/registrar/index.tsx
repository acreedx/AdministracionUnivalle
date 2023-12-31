import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import {
  ICrearServicio,
  IListarServicios,
} from "../../../utils/interfaces/servicios";
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
import {
  checkValidation,
  onlyLettersAndNumbers,
  resetDefaultValFlags,
  validateImg,
} from "utils/functions/validations";

function RegistrarServicioPageModal() {
  const [serviceImg, setImg]: any = useState(null);

  const router = useRouter();

  const [servicioData, setServicioData] = useState<ICrearServicio>({
    nombre: "",
    moduloId: 16,
    imagenUrl: null,
  });
  const inputFileImg: any = useRef(null);
  const [flags, setFlags] = useState({
    nombre: undefined,
    imagen: undefined,
  });
  const [textErrors, setTextErrors] = useState({
    nombre: "",
    imagen: "",
  });

  const [users, setUsers] = useState<IListarServicios[]>([]);

  const getData = async (url: string) => {
    try {
      const query = await fetch(url);
      if (query.ok) {
        const response: any = await query.json();
        if (response.data != null) {
          setUsers(response.data);
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      errorAlert("Ocurrió un error");
    }
  };

  const handleChange2 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    const value = e.target.value;
    const emptyStringValue = value.match(/^(\s*)(.*)(\s*)$/);
    let valid: any = true;
    let validText = "";

    if (value.length === 0) {
      valid = undefined;
    } else if (
      !onlyLettersAndNumbers(value) ||
      value.length >= 50 ||
      (emptyStringValue || [])[1].length > 0
    ) {
      valid = false;
    }

    if (!onlyLettersAndNumbers(value)) {
      validText = "El nombre solo debe contener números y letras";
    } else if (value.length >= 50) {
      validText = "El nombre solo puede tener 50 caracteres como máximo";
    } else if ((emptyStringValue || [])[1].length > 0) {
      validText = "El nombre no puede tener espacios al inicio";
    } else {
      validText = "Nombre ingresado válido";
    }

    setFlags((prev) => ({ ...prev, nombre: valid }));
    setTextErrors((prev) => ({ ...prev, nombre: validText }));

    setServicioData((prevData: any) => ({
      ...prevData,
      [campo]: value,
    }));
  };

  const clearValidations = () => {
    setFlags(resetDefaultValFlags(flags, undefined));
    setTextErrors(resetDefaultValFlags(textErrors, ""));
  };

  const clearData = () => {
    setServicioData({
      ...servicioData,
      nombre: "",
      moduloId: 1,
      imagenUrl: null,
    });
    clearImg();
    clearValidations();
  };

  const registrarServicio = () => {
    if (users.find((u: any) => u.nombre === servicioData.nombre)) {
      warningAlert("El servicio ingresado ya existe");
    } else {
      if (checkValidation(flags) && servicioData.imagenUrl != null) {
        fetch("https://apisistemaunivalle.somee.com/api/Servicios/addServicio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
        })
          .then(async (response) => {
            if (response.ok) {
              const res:any= await response.json();
              successAlert("Éxito al registrar los datos");
              setTimeout(() => {
                router.push(`/consultorioOdontologico/editar/${res.data.id}`);
            }, 2000);
            } else {
              throw new Error("Error al cambiar los datos del servicio");
            }
          })
        .catch(() => errorAlert("Error al registrar los datos"));
      } else {
        warningAlert("Rellene todos los campos de manera correcta");
      }
    }
  };

  const clearImg = () => {
    setImg(null);
    if (inputFileImg.current) {
      inputFileImg.current.value = null;
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];

    let valid: any = true;
    let validText = "";

    let imgRes = validateImg(value);

    if (imgRes == 0) {
      valid = undefined;
    } else if (imgRes === 2 || imgRes === 3) {
      valid = false;
    }

    if (imgRes == 1) {
      setImg(value);
    } else {
      clearImg();
    }

    validText =
      imgRes === 1
        ? "Imagen válida"
        : imgRes === 2
        ? "Solo se permite imágenes con tamaño menor a 10MB"
        : imgRes === 3
        ? "Solo se permiten imágenes jpg y png"
        : "";

    setFlags((prev) => ({ ...prev, imagen: valid }));
    setTextErrors((prev) => ({
      ...prev,
      imagen: validText,
    }));
  };

  const subirArchivos = async () => {
    servicioData.imagenUrl = null;
    if (serviceImg != null) {
      servicioData.imagenUrl = await uploadFile(serviceImg, "servicios/");
    }
    registrarServicio();
  };

  useEffect(() => {
    getData(
      "https://apisistemaunivalle.somee.com/api/Servicios/getServicioByModuloId/16"
    );
  }, []);

  return (
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <PageTitle>Registrar servicio - Clínica Odontológica</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div>
        <Label>
          <span className="text-lg">Nombre del servicio</span>
          <Input
            value={servicioData.nombre}
            className="mt-1"
            valid={flags.nombre}
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange2(e, "nombre")}
          />
          {flags.nombre != null && (
            <HelperText valid={flags.nombre}>{textErrors.nombre}</HelperText>
          )}
        </Label>

        <Label className="mt-4">
          <span className=" text-lg">
            Imagen de referencia para el servicio
          </span>
          <div className="text-center mb-5">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <span>Imagen</span>
                <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      serviceImg === null
                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                        : URL.createObjectURL(serviceImg)
                    }
                    alt="Imagen de Ubicación Nueva"
                  />
                </div>
              </div>
            </div>
          </div>
          <Input
            ref={inputFileImg}
            valid={flags.imagen}
            type="file"
            className="mt-1"
            placeholder="Imagen para el servicio"
            accept="image/jpeg, image/png"
            onChange={(e) => handleImageChange(e)}
          />
          {flags.imagen != null && (
            <HelperText valid={flags.imagen}>{textErrors.imagen}</HelperText>
          )}
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
      <ToastContainer />
    </div>
  );
}

export default RegistrarServicioPageModal;
