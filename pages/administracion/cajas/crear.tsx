import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";

function CrearServicio() {
  const [name, setname] = useState("");

  const [ubicacion, setubicacion] = useState("");

  const [encharged, setencharged] = useState("");

  const [cellphone, setcellphone] = useState("");
  const [imgUrl, setimgUrl] = useState("");

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setvalidationMessage] = useState<string>("");

  const router = useRouter();
  const createServiceRoute = "Servicios/addServicio";
  const createUbicacionRoute = "Ubicaciones/addUbicaciones";
  const createReferencesRoute = "Referencia/addReferences";
  const moduleId = 2;

  const handleSubmit = async () => {
    if (name == "" || name == null) {
      setvalidationMessage("Debe rellenar el campo de Nombre");
      setShowAlertValidation(true);
      return;
    }
    if (imgUrl == "" || imgUrl == null) {
      setvalidationMessage("Debe rellenar el campo de Imagen");
      setShowAlertValidation(true);
      return;
    }
    if (ubicacion == "" || ubicacion == null) {
      setvalidationMessage("Debe rellenar el campo de Ubicación");
      setShowAlertValidation(true);
      return;
    }
    if (encharged == "" || encharged == null) {
      setvalidationMessage("Debe rellenar el campo de Encargado");
      setShowAlertValidation(true);
      return;
    }
    if (cellphone == "" || cellphone == null) {
      setvalidationMessage("Debe rellenar el campo de Teléfono");
      setShowAlertValidation(true);
      return;
    }
    const newService = await fetch(`${URL.baseUrl}${createServiceRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        moduloId: moduleId,
        imagenUrl: imgUrl,
        idCategoria: null,
      }),
    });
    const dataNewService = await newService.json();
    const newServiceId = dataNewService.data.id;
    await fetch(`${URL.baseUrl}${createUbicacionRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: ubicacion,
        imagen: "",
        video: "",
        serviciosId: newServiceId,
        estado: true,
      }),
    });
    await fetch(`${URL.baseUrl}${createReferencesRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: encharged,
        numerocel: cellphone,
        serviciosId: newServiceId,
        estado: true,
      }),
    });
    router.back();
  };
  return (
    <Layout>
      <PageTitle>Crear un nuevo servicio</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Label>
            <span>Nombre del servicio</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del servicio"
              onChange={(e) => setname(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Imagen</span>
            <Input
              className="mt-1"
              placeholder="Ingresa la URL de la imagen"
              onChange={(e) => setimgUrl(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Ubicación</span>
            <Input
              className="mt-1"
              placeholder="Ingresa la ubicación del servicio"
              onChange={(e) => setubicacion(e.target.value)}
            />
          </Label>
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
          <Label className="mt-4">
            <div className="relative text-gray-500 focus-within:text-purple-600">
              <input className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" />
              <button
                type={"button"}
                onClick={() => setShowAlert(true)}
                className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Crear
              </button>
            </div>
          </Label>
        </form>
      </div>
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
    </Layout>
  );
}

export default CrearServicio;
