import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";
import { GetServerSidePropsContext } from "next";

import { ITramitesData, convertJSONService } from "utils/demo/tramitesData";

interface props {
  id: number;
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  return {
    props: {
      id,
    },
  };
}

function ModificarTramite({ id }: props) {
  const route = "Servicios/getTramiteById/";

  const [name, setname] = useState("");

  // ! Requisitos
  const [requisitos, setRequisitos] = useState<string[]>(['']);
  // ! Paso requisito
  const [pasoRequisito, setPasoRequisitos] = useState<Array<Array<string>>>([[]]);

  const agregarRequisito = () => {
    console.log("Se agrego nuevo requisito")
    setRequisitos([...requisitos, '']);
    //   setPasoRequisitos([...pasoRequisito, []]);
  }

  const agregarPasoRequisito = (requisitoIndex: number) => {
    const nuevosPasosRequisitos = [...pasoRequisito];

    if (!nuevosPasosRequisitos[requisitoIndex]) {
      nuevosPasosRequisitos[requisitoIndex] = [];
    }

    nuevosPasosRequisitos[requisitoIndex].push("");

    setPasoRequisitos(nuevosPasosRequisitos);
    console.log('Requisitos actualizados:', nuevosPasosRequisitos);
  };



  const eliminarPasoRequisito = (requisitoIndex: number, pasoIndex: number) => {
    console.log('Índice de requisito:', requisitoIndex, 'Índice de PASO requisito a eliminar:', pasoIndex);

    const nuevosPasosRequisitos = [...pasoRequisito];
    nuevosPasosRequisitos[requisitoIndex].splice(pasoIndex, 1);

    // ! Verificar si es el último pasoRequisito en el requisito
    if (nuevosPasosRequisitos[requisitoIndex].length === 0 || pasoIndex === nuevosPasosRequisitos[requisitoIndex].length) {
      // ! eliminar el ultimo requisito si se elimina el ultimo pasoRequisito
      const nuevosRequisitos = [...requisitos];
      nuevosRequisitos.splice(requisitoIndex, 1);
      nuevosPasosRequisitos.splice(requisitoIndex, 1);
      setRequisitos(nuevosRequisitos);
    } else {
      setPasoRequisitos(nuevosPasosRequisitos);
    }

    console.log(nuevosPasosRequisitos);
  };
  const eliminarRequisito = (requisitoIndex: number) => {
    console.log("Indice de requisito a eliminar", requisitoIndex)
    const nuevosRequisitos = [...requisitos];
    nuevosRequisitos.splice(requisitoIndex, 1);
    const nuevosPasosRequisitos = [...pasoRequisito];
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
    setPasoRequisitos(nuevosPasosRequisitos);
  };

  const [encharged, setencharged] = useState("");

  const [cellphone, setcellphone] = useState("");

  const [processingTime, setprocessingTime] = useState("");

  const [locations, setLocations] = useState<string[]>(['']);


  const agregarLocation = () => {
    setLocations([...locations, '']);
  }
  const eliminarLocation = (locationIndex: number) => {

    const nuevasLocation = [...locations];
    nuevasLocation.splice(locationIndex, 1);
    console.log("location a eliminar: ", locationIndex)
    setLocations(nuevasLocation);
  }




  const [showAlert, setShowAlert] = useState<boolean>(false);


  const router = useRouter();
  const [service, setService] = useState<ITramitesData>();

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => setService(convertJSONService(res.data[0])));
    }
    doFetch();
  }, []);




  // Added Service 
  const updateServiceRoute = "Servicios/updateServicio/";
  const updateReferencesRoute = "Referencia/UpdateReferences/";
  const updateDurationServiceRoute = "Tramites/updateTramite/";
  const updateRequisitoRoute = "Requisitos/updateRequisito/";
  const getRequisitosByID = "Requisitos/getRequisitosByServiceId/";

  const moduleId = 3;

  const handleSubmit = async () => {
    try {

      await fetch(`${URL.baseUrl}${updateServiceRoute}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          imagenUrl: "",
        }),
      });
      //   const dataNewService = await newService.json();
      //   const newServiceId = dataNewService.data.id;

      await updateRequisitos(id);


      await fetch(
        `${URL.baseUrl}${updateReferencesRoute}${service?.enchargedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: encharged,
            numerocel: cellphone,
            serviciosId: id,
          }),
        }
      );

      await fetch(`${URL.baseUrl}${updateDurationServiceRoute}${service?.durationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiempotramite: processingTime,
          serviciosId: id,
        }),
      });

    } catch (error) {
      console.error("Error al crear el servicio y requisitos:", error);
    }
  };

  const updateRequisitos = async (serviceId: number) => {
    for (const requisito of requisitos) {
      if (requisito.trim() !== '') {
        const nuevosPasos = pasoRequisito[requisitos.indexOf(requisito)].map((nombre) => ({ nombre }));
        // Enviar la solicitud solo si el requisito no está vacío

        const updateRequisitoResponse = await fetch(`${URL.baseUrl}${updateRequisitoRoute}${service?.requerimentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: requisito,
            serviciosId: serviceId,
            pasos: nuevosPasos,
            estado: true,
          }),
        });

        console.log("Respuesta del servidor al crear el requisito:", updateRequisitoResponse);

      }
    }
  };


  const handleAlertConfirm = () => {
    // handleSubmit();
    setShowAlert(false);
    handleSubmit();
  };
  useEffect(() => {
    if (service?.name) {
      setname(service!.name);
      setprocessingTime(service!.duration);
      setencharged(service!.encharged);
      setcellphone(service!.cellphone);
    }
  }, [service]);

  const obtenerRequisitosDelServicio = async (serviceId: number) => {
    try {
      const response = await fetch(`${URL.baseUrl}${getRequisitosByID}${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;

      } else {
        throw new Error("No se pudieron obtener los requisitos del servicio");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };


  useEffect(() => {
    async function obtenerYConfigurarRequisitos() {
      const requisitosDelServicio = await obtenerRequisitosDelServicio(id);

      console.log("Datos de requisitosDelServicio:", requisitosDelServicio);

      if (requisitosDelServicio.success === 1 && requisitosDelServicio.data.length > 0) {
        const nuevosRequisitos = requisitosDelServicio.data.map((requisito: any) => requisito.descripcion);
        const nuevosPasosRequisitos = requisitosDelServicio.data.map((requisito: any) =>
          requisito.pasosRequisito.map((paso: any) => paso.nombre)
        );

        setRequisitos(nuevosRequisitos);
        setPasoRequisitos(nuevosPasosRequisitos);
      }
    }

    obtenerYConfigurarRequisitos();
  }, [id]);


  const handleAlertCancel = () => {
    setShowAlert(false);
  };
  return (
    <Layout>
      <PageTitle>Editar tramite</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Label>
            <span>Nombre del tramite</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del tramite"
              value={name}
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
              <div key={requisitoIndex}>
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
                    className="mt-1 mb-1"
                    placeholder="Ingresa el requisito"
                    value={requisito}
                    onChange={(e) => handleRequisitoChange(e, requisitoIndex)}
                  />

                </div>
                {pasoRequisito[requisitoIndex] && pasoRequisito[requisitoIndex].map((paso, pasoIndex) => (
                  <div className="flex items-center ml-20" key={pasoIndex}>
                    <button
                      className="text-white px-2 py-1 rounded-full mr-2"
                      type="button"
                      onClick={() => eliminarPasoRequisito(requisitoIndex, pasoIndex)}
                    >
                      <MinusIcon />
                    </button>
                    <Input
                      className="mt-1 mb-1"
                      placeholder="Ingresa el paso del requisito"
                      value={paso}
                      onChange={(e) => handlePasoRequisitoChange(e, requisitoIndex, pasoIndex)}
                    />

                  </div>
                ))}
              </div>
            ))}
          </Label>

          <Label className="mt-4">
            <span>Duracion del tramite</span>
            <Input
              className="mt-1"
              placeholder="Ingresa la duracion del tramite"
              value={processingTime}
              onChange={(e) => setprocessingTime(e.target.value)}
            />
          </Label>

          <Label className="mt-4">
            <span>Encargado</span>
            <Input
              className="mt-1"
              value={encharged}
              placeholder="Ingresa el nombre completo del encargado"
              onChange={(e) => setencharged(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Teléfono de referencia</span>
            <Input
              className="mt-1"
              value={cellphone}
              placeholder="Ingresa el teléfono de referencia del encargado"
              onChange={(e) => setcellphone(e.target.value)}
            />
          </Label>

          <Label className="mt-4">
            <span>Seleccione una categoria de tramite</span>
            <Select className="mt-1">
              <option>$1,000</option>
              <option>$5,000</option>
              <option>$10,000</option>
              <option>$25,000</option>
            </Select>
          </Label>


          {/* *Ubicaciones */}
          <Label className="mt-4">
            <div className="flex items-center mt-4">
              <span className="mr-2">Ubicaciones</span>
              <button type="button" onClick={agregarLocation}>
                <PlusIcon />
              </button>
            </div>

            {locations.map((location, locationIndex) => (
              <div key={locationIndex} className={locationIndex === locations.length - 1 ? 'hidden' : ''}>
                <div className="flex">
                  <button
                    className="text-white px-2 py-1 rounded-full mr-2"
                    type="button"
                    onClick={() => eliminarLocation(locationIndex)}
                  >
                    <MinusIcon />
                  </button>
                  <Input
                    className="mt-1 mb-1"
                    placeholder="Ingrese la ubicación del servicio"
                  />
                </div>

                <div className="flex justify-center space-x-20 mb-2">
                  <Label className="mt-4">
                    <span>Imagen de la ubicación del lugar</span>
                    <Input
                      type="file"
                      className="mt-1"
                      placeholder="Imagen para ubicación"
                    />
                  </Label>
                  <Label className="mt-4">
                    <span>Croquis de la ubicación del lugar</span>
                    <Input
                      type="file"
                      className="mt-1"
                      placeholder="Imagen para ubicación"
                    />
                  </Label>
                </div>
              </div>
            ))}
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

export default ModificarTramite;
