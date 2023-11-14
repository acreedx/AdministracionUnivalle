import React, { useState, useRef, ChangeEvent } from "react";
import { HelperText, Input, Label } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import { successAlert, errorAlert, warningAlert } from "../alerts";
import { ToastContainer } from "react-toastify";
import { uploadFile } from "../../firebase/config";
import { IAddObjPerdido } from "utils/interfaces/ObjetosPerdidos";
import { useRouter } from "next/router";
import {
  onlyLettersAndNumbers,
  resetDefaultValFlags,
  validateImg,
  checkValidation,
} from "utils/functions/validations";

function AgregarObjPerdidoPage() {
  const router = useRouter();
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [objPerdido, setObjPerdido] = useState<IAddObjPerdido>({
    titulo: "",
    archivo: "",
  });

  const [flags, setFlags] = useState({
    nombre: undefined,
    imagen: undefined,
  });
  const [textErrors, setTextErrors] = useState({
    nombre: "",
    imagen: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    const value = e.target.value;
    let valid: any = true;
    let validText = "";

    if (value.length === 0) {
      valid = undefined;
    } else if (!onlyLettersAndNumbers(value) || value.length >= 50) {
      valid = false;
    }

    if (!onlyLettersAndNumbers(value)) {
      validText = "El nombre solo debe contener números y letras";
    } else if (value.length >= 50) {
      validText = "El nombre solo puede tener 50 caracteres como máximo";
    } else {
      validText = "Nombre ingresado válido";
    }

    setFlags((prev) => ({ ...prev, nombre: valid }));
    setTextErrors((prev) => ({ ...prev, nombre: validText }));

    setObjPerdido((prevData: any) => ({
      ...prevData,
      [campo]: value,
    }));
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

  const registrarObjPer = () => {
    if (checkValidation(flags) && objPerdido.archivo != null) {
      fetch(
        "http://apisistemaunivalle.somee.com/api/Publicaciones/AddPublicaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: objPerdido.titulo,
            archivo: objPerdido.archivo,
            serviciosId: 1,
            estado: true,
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al registrar los datos");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            throw new Error("Error al registrar los datos");
          }
        })
        .catch((e) => {
          console.log(e);
          errorAlert("Error al registrar los datos");
        });
    } else {
      warningAlert("Rellene todos los campos de manera correcta");
    }
  };

  const clearValidations = () => {
    setFlags(resetDefaultValFlags(flags, undefined));
    setTextErrors(resetDefaultValFlags(textErrors, ""));
  };

  const clearImg = () => {
    setImg(null);
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
    clearImg();
    clearValidations();
  };

  const subirArchivos = async () => {
    objPerdido.archivo = "";
    if (objPerImg != null) {
      objPerdido.archivo = await uploadFile(objPerImg, "objetosPerdidos/");
    }
    registrarObjPer();
  };

  return (
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <PageTitle>Agregar Objeto Perdido - Bienestar Universitario</PageTitle>

      <div>
        <Label>
          <span>Nombre o descripción del objeto perdido</span>
          <Input
            value={objPerdido.titulo}
            className="mt-1"
            valid={flags.nombre}
            placeholder="Escriba aquí el nombre o la descripción de la imagen"
            onChange={(e) => handleChange(e, "titulo")}
          />
          {flags.nombre != null && (
            <HelperText valid={flags.nombre}>{textErrors.nombre}</HelperText>
          )}
        </Label>

        <Label className="mt-4">
          <span className=" text-lg">Imagen del objeto perdido</span>
          <div className="text-center mb-5">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <span>Imagen</span>
                <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      objPerImg === null
                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                        : URL.createObjectURL(objPerImg)
                    }
                    alt="Imagen del objeto perdido"
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
            accept="image/jpeg, image/png"
            placeholder="Imagen del objeto perdido"
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

export default AgregarObjPerdidoPage;
