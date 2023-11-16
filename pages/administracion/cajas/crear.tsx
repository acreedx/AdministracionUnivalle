import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import SweetAlert from "react-bootstrap-sweetalert";
import SectionTitle from "example/components/Typography/SectionTitle";
import { errorAlert } from "components/alerts";
import { uploadFile } from "../../../firebase/config";
import { ToastContainer } from "react-toastify";
import referencesProvider from "../../../utils/providers/referencesProvider";
import ubicacionesProvider from "../../../utils/providers/ubicacionesProvider";
import servicesProvider from "../../../utils/providers/servicesProvider";
import requirementsProvider from "../../../utils/providers/requirementsProvider";

function CrearServicio() {
  const [name, setname] = useState("");
  const [encharged, setencharged] = useState("");
  const [cellphone, setcellphone] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setvalidationMessage] = useState<string>("");
  const [formIsValid, setformIsValid] = useState(Boolean);
  const router = useRouter();
  const [serviceImg, setImg]: any = useState(null);
  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };
  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };
  const handleRemoveRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };
  const handleRemoveLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const handleSubmit = async () => {
    ValidateForm();
    if (formIsValid) {
      try {
        const uploadedImageUrl = await uploadFile(
          serviceImg,
          "ubicaciones/imagenes/"
        );
        const ServiceId = await servicesProvider.CreateService(
          name,
          uploadedImageUrl
        );
        await ubicacionesProvider.CreateUbicaciones(locations, ServiceId);
        await referencesProvider.CreateReference(
          encharged,
          cellphone,
          ServiceId
        );
        await requirementsProvider.CreateRequirements(requirements, ServiceId);

        router.push("../cajas");
      } catch (e: any) {
        setShowAlert(false);
        setShowAlertValidation(false);
        errorAlert(e);
      }
    }
  };
  function ValidateForm() {
    if (name == "" || name == null) {
      setvalidationMessage("Debe rellenar el campo de Nombre");
      setShowAlertValidation(true);
      setformIsValid(false);
      return;
    }
    if (encharged == "" || encharged == null) {
      setvalidationMessage("Debe rellenar el campo de Encargado");
      setShowAlertValidation(true);
      setformIsValid(false);
      return;
    }
    if (cellphone == "" || cellphone == null) {
      setvalidationMessage("Debe rellenar el campo de Teléfono");
      setShowAlertValidation(true);
      setformIsValid(false);
      return;
    }
    setformIsValid(true);
  }
  return (
    <Layout>
      <PageTitle>Crear un nuevo servicio</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            className="mt-1"
            placeholder="Ingresa el nombre del servicio"
            onChange={(e) => setname(e.target.value)}
          />
        </Label>
        <Label className="mt-4">
          <span className=" text-lg">Imagen de referencia del tramite</span>
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    serviceImg === null
                      ? "https://t3.ftcdn.net/jpg/02/68/55/60/360_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg"
                      : URL.createObjectURL(serviceImg)
                  }
                  alt="Imagen de Ubicación Nueva"
                />
              </div>
            </div>
          </div>
        </Label>
        <Input
          type="file"
          accept=".jpg, .jpeg, .png"
          className="mt-4"
          placeholder="Imagen del servicio"
          onChange={(e) => setImg(e.target.files?.[0] || null)}
        />
        <Label className="mt-4">
          <span>Encargado</span>
          <Input
            className="mt-1"
            placeholder="Ingresa el encargado del servicio"
            onChange={(e) => setencharged(e.target.value)}
          />
        </Label>
        <Label className="mt-4">
          <span>Teléfono de referencia</span>
          <Input
            type="number"
            className="mt-1"
            placeholder="Ingresa el teléfono de referencia"
            onChange={(e) => setcellphone(e.target.value)}
          />
        </Label>
      </div>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Requisitos</SectionTitle>
        {requirements.map((requirement, index) => (
          <div key={index}>
            <div className="flex flex-row items-center">
              <Input
                type="text"
                className="mt-1 mb-4"
                value={requirement}
                placeholder="Ingresa el nombre del requisito"
                onChange={(e) => handleRequirementChange(index, e.target.value)}
              />
              <div className="ml-4">
                <Button
                  size="small"
                  onClick={() => {
                    handleRemoveRequirement(index);
                  }}
                >
                  -
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-row-reverse ...">
          <div>
            <Button
              size="small"
              onClick={() => {
                setRequirements([...requirements, ""]);
              }}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Ubicaciones</SectionTitle>
        {locations.map((location, index) => (
          <div key={index}>
            <div className="flex flex-row items-center">
              <Input
                type="text"
                className="mt-1 mb-4"
                value={location}
                placeholder="Ingresa una ubicación"
                onChange={(e) => handleLocationChange(index, e.target.value)}
              />
              <div className="ml-4">
                <Button
                  size="small"
                  onClick={() => {
                    handleRemoveLocation(index);
                  }}
                >
                  -
                </Button>
              </div>
            </div>
            {/*<div>
              <Label className="mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <span>Nueva Imagen</span>
                      <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            serviceImgArray == null ||
                            serviceImgArray.length == 0 ||
                            serviceImgArray[index] == null
                              ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                              : URL.createObjectURL(serviceImgArray[index])
                          }
                          alt="Imagen de Ubicación Nueva"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Label>
              <Input
                type="file"
                accept=".jpg, .jpeg, .png"
                className="mt-4"
                placeholder="Imagen del servicio"
                onChange={(e) =>
                  handleSetLocation(index, e.target.files?.[0] || null)
                }
              />
            </div>*/}
          </div>
        ))}
        <div className="flex flex-row-reverse ...">
          <div>
            <Button
              size="small"
              onClick={() => {
                setLocations([...locations, ""]);
              }}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <Label className="mb-4">
        <div className="relative text-gray-500 focus-within:text-purple-600">
          <input
            className="block w-full py-2 pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
            disabled
          />
          <button
            type={"button"}
            onClick={() => setShowAlert(true)}
            className="absolute inset-y-0 right-0 px-4 py-2 text-lg font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Crear
          </button>
        </div>
      </Label>

      {showAlert && (
        <SweetAlert
          warning
          title="Atención"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          showCancel
          onConfirm={() => {
            handleSubmit();
          }}
          onCancel={() => {
            setShowAlert(false);
          }}
        >
          Confirma todos los datos del nuevo servicio?
        </SweetAlert>
      )}
      {showAlertValidation && (
        <SweetAlert
          error // Puedes personalizar el tipo de alerta (success, error, warning, etc.)
          title="Atención"
          confirmBtnText="Ok"
          onConfirm={() => {
            setShowAlertValidation(false);
            setShowAlert(false);
          }}
        >
          {validationMessage}
        </SweetAlert>
      )}
      <ToastContainer />
    </Layout>
  );
}

export default CrearServicio;
