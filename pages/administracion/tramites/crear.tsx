import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "@roketid/windmill-react-ui";
import { DangerIcon } from "@roketid/windmill-react-ui/dist/Alert";
import { PlusIcon, MinusIcon } from "icons";
function CrearTramite() {

  const [name, setname] = useState("");

  const [requisitos, setRequisitos] = useState<string[]>(['']);
  const agregarRequisito = () => {
    setRequisitos([...requisitos, '']);
  }

  const handleRequisitoChange = (e: any, index: any) => {
    const nuevosRequisistos = [...requisitos];
    nuevosRequisistos[index] = e.target.value;
    setRequisitos(nuevosRequisistos);
  };

  const [encharged, setencharged] = useState("");

  const [cellphone, setcellphone] = useState("");

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const router = useRouter();
  const createServiceRoute = "Servicios/addServicio";
  const createUbicacionRoute = "Ubicaciones/addUbicaciones";
  const createReferencesRoute = "Referencia/addReferences";
  const moduleId = 2;
  const handleSubmit = async () => {
    const newService = await fetch(`${URL.baseUrl}${createServiceRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        moduloId: moduleId,
        imagenUrl: "",
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
        descripcion: location,
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
  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
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
            <div className="flex items-center mt-4">
              <span className="mr-2">Requisitos</span>
              <button className="" type="button" onClick={agregarRequisito}>
                <PlusIcon />
              </button>
            </div>
            {requisitos.map((requisito, index) => (
              <div key={index} className="flex items-center ">
                <button
                  className="text-white px-2 py-1 rounded-full -mr-2"
                  type="button"
                  onClick={agregarRequisito}
                >

                  <PlusIcon />
                </button>

                <button
                  className="text-white px-2 py-1 rounded-full mr-2"
                  type="button"
                  onClick={agregarRequisito}
                >

                  <MinusIcon />
                </button>
                <Input
                  className="mt-1"
                  placeholder="Ingresa el requisito"
                  value={requisito}
                  onChange={(e) => handleRequisitoChange(e, index)}
                />
              </div>
            ))}

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
                Click
              </button>
              {showAlert && (
                <SweetAlert
                  warning // Puedes personalizar el tipo de alerta (success, error, warning, etc.)
                  title="Atención"
                  confirmBtnText="Confirmar"
                  cancelBtnText="Cancelar"
                  showCancel
                  onConfirm={handleAlertConfirm}
                  onCancel={handleAlertCancel}
                >
                  Confirma todos los datos del nuevo servicio?
                </SweetAlert>
              )}
            </div>
          </Label>
        </form>
      </div>
    </Layout>
  );
}

export default CrearTramite;
