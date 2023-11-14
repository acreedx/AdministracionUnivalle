import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { HelperText, Input, Label } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import { successAlert, errorAlert, warningAlert } from "../alerts";
import { ToastContainer } from "react-toastify";
import { uploadFile } from "../../firebase/config";

import { IAddObjPerdido } from "utils/interfaces/ObjetosPerdidos";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { isValidUrl } from "utils/functions/url";
import {
  onlyLettersAndNumbers,
  resetDefaultValFlags,
  validateImg,
  checkValidation,
  checkValidationEdit,
} from "utils/functions/validations";

function EditarObjPerdidoPage(props: { id: number }) {
  const objId = props.id;
  const inputFileImg: any = useRef(null);
  const [objPerImg, setImg]: any = useState(null);
  const [objPerData, setObjPerData] = useState<IAddObjPerdido>({
    titulo: "",
    archivo: "",
  });
  const [objPerBkData, setObjPerBkData] = useState<IAddObjPerdido>({
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

  async function cargarDatosObj(id: number) {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Publicaciones/GetPublicacionByID/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();
      setObjPerData({
        titulo: resData.data[0].titulo,
        archivo: resData.data[0].archivo,
      });
      setObjPerBkData({
        titulo: resData.data[0].titulo,
        archivo: resData.data[0].archivo,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    const value = e.target.value;
    const emptyStringValue = value.match(/^(\s*)(.*)(\s*)$/);

    let valid: any = true;
    let validText = "";

    if (value === objPerBkData.titulo) {
      valid = undefined;
    } else if (
      !onlyLettersAndNumbers(value) ||
      value.length >= 50 ||
      value.length == 0 ||
      (emptyStringValue || [])[1].length > 0
    ) {
      valid = false;
    }

    if (!onlyLettersAndNumbers(value)) {
      validText = "El nombre solo debe contener números y letras";
    } else if (value.length >= 50) {
      validText = "El nombre solo puede tener 50 caracteres como máximo";
    } else if (value.length == 0 || (emptyStringValue || [])[1].length > 0) {
      validText = "El nombre no puede ser vacío";
    } else {
      validText = "Nombre ingresado válido";
    }

    setFlags((prev) => ({ ...prev, nombre: valid }));
    setTextErrors((prev) => ({ ...prev, nombre: validText }));

    setObjPerData((prevData: any) => ({
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

  const editarObjPer = async (id: number) => {
    let send = true;
    const check = checkValidationEdit(flags);
    if (check === 0) {
      send = false;
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
    if (check === 2) {
      send = false;
      warningAlert("Si desea editar, ingrese valores válidos");
    }

    if (send) {
      objPerData.archivo = await uploadFile(objPerImg, "objetosPerdidos/");
      fetch(
        `https://apisistemaunivalle.somee.com/api/Publicaciones/UpdatePublicaciones/${id}`,
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
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            throw new Error();
          }
        })
        .catch(() => errorAlert("Error al cambiar los datos del servicio"));
    }
  };

  const clearImg = () => {
    setImg(null);
    if (inputFileImg.current) {
      inputFileImg.current.value = null;
    }
  };

  const clearData = () => {
    setObjPerData(objPerBkData);
    clearImg();
    clearValidations();
  };

  const clearValidations = () => {
    setFlags(resetDefaultValFlags(flags, undefined));
    setTextErrors(resetDefaultValFlags(textErrors, ""));
  };

  useEffect(() => {
    cargarDatosObj(objId);
  }, []);

  return (
    <div>
      <PageTitle>Editar Objeto Perdido - Bienestar Universitario</PageTitle>

      <div className="px-4 py-3 mb-8 text-white bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre o descripción del objeto perdido</span>
          <Input
            value={objPerData.titulo}
            className="mt-1"
            maxLength={50}
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
                        ? !isValidUrl(objPerBkData.archivo)
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                          : objPerData.archivo
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
            Reestablecer valores
          </Button>
        </div>

        <div>
          <Button size="large" onClick={() => editarObjPer(objId)}>
            Editar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditarObjPerdidoPage;
