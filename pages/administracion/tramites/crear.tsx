import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";


function CrearTramite() {

  const [name, setname] = useState("");

  // ! Requisitos
  const [requisitos, setRequisitos] = useState<string[]>([]);
  // ! Paso requisito
  const [pasoRequisito, setPasoRequisitos] = useState<Array<Array<string>>>([]);


  const agregarRequisito = () => {
    console.log('Requisitos antes de agregar:', requisitos);
    console.log('Pasos de requisito antes de agregar:', pasoRequisito);

    if (requisitos.length === 0) {
      setRequisitos(['']);
      setPasoRequisitos([[]]);
    } else {
      setRequisitos([...requisitos, '']);
      setPasoRequisitos([...pasoRequisito, []]);
    }

    console.log('Requisitos actualizados:', requisitos);
    console.log('Pasos de requisito actualizados:', pasoRequisito);
  }
  const agregarPasoRequisito = (requisitoIndex: number) => {
    const nuevosPasosRequisitos = [...pasoRequisito];
    nuevosPasosRequisitos[requisitoIndex].push("");

    setPasoRequisitos(nuevosPasosRequisitos);
  }

  const eliminarRequisito = (requisitoIndex: number) => {
    console.log('Índice de requisito a eliminar:', requisitoIndex);

    const nuevosRequisitos = requisitos.slice();
    nuevosRequisitos.splice(requisitoIndex, 1);

    const nuevosPasosRequisitos = pasoRequisito.slice();
    nuevosPasosRequisitos.splice(requisitoIndex, 1);

    setRequisitos(nuevosRequisitos);
    setPasoRequisitos(nuevosPasosRequisitos);
  };



  const handleRequisitoChange = (e: any, index: any) => {
    const nuevosRequisistos = [...requisitos];
    nuevosRequisistos[index] = e.target.value;
    setRequisitos(nuevosRequisistos);
  };

  const handlePasoRequisitoChange = (e: any, requisitoIndex: number, pasoIndex: number) => {
    const nuevosPasosRequisitos = [...pasoRequisito];
    nuevosPasosRequisitos[requisitoIndex][pasoIndex] = e.target.value;
    setPasoRequisitos([...nuevosPasosRequisitos]);
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
      <PageTitle>Crear un tramite</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Label>
            <span>Nombre del servicio</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del tramite"
              onChange={(e) => setname(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <div className="flex items-center mt-4">
              <span className="mr-2">Requisitos</span>
              <button type="button" onClick={agregarRequisito}>
                <PlusIcon />
              </button>
            </div>

            {requisitos.map((requisito, requisitoIndex) => (
              <div key={requisitoIndex} className={requisitoIndex == requisitos.length - 1 ? 'hidden' : ''}
              >
                <div className="flex">
                  <button
                    className="text-white px-2 py-1 rounded-full -mr-2"
                    type="button"
                    onClick={() => agregarPasoRequisito(requisitoIndex)}
                  >
                    <PlusIcon />
                  </button>

                  <button
                    className="text-white px-2 py-1 rounded-full mr-2"
                    type="button"
                    onClick={() => eliminarRequisito(requisitoIndex)}
                  >
                    <MinusIcon />
                  </button>

                  <Input
                    className="mt-1 mb-1 "
                    placeholder="Ingresa el requisito"

                    value={requisito}
                    onChange={(e) => handleRequisitoChange(e, requisitoIndex)}
                    key={`requisito-${requisitoIndex}`} // Agrega una clave única
                  />
                </div>
                {pasoRequisito[requisitoIndex].map((pasoRequisito, pasoIndex) => (
                  <div className="flex items-center ml-20" key={pasoIndex}>
                    <button
                      className="text-white px-2 py-1 rounded-full mr-2"
                      type="button"
                      onClick={() => console.log("test")}
                    >
                      <MinusIcon />
                    </button>
                    <Input
                      key={`pasoRequisito-${pasoIndex}`} // Agrega una clave única
                      className="mt-1 mb-1"
                      placeholder="Ingresa el paso del requisito"
                      value={pasoRequisito}
                      onChange={(e) => handlePasoRequisitoChange(e, requisitoIndex, pasoIndex)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </Label>
          <Label className="mt-4">
            <span>Encargado</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el encargado del tramite"
              onChange={(e) => setencharged(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Teléfono de referencia</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el teléfono de referencia del encargado"
              onChange={(e) => setcellphone(e.target.value)}
            />
          </Label>

          <Label className="mt-4">
            <span>Tipo de tramite</span>
            <Select className="mt-1">
              <option>$1,000</option>
              <option>$5,000</option>
              <option>$10,000</option>
              <option>$25,000</option>
            </Select>
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
    </Layout >
  );
}

export default CrearTramite;
