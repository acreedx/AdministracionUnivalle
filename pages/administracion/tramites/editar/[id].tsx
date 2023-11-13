import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URLS from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";
import { GetServerSidePropsContext } from "next";
import { ITramitesData, convertJSONService } from "utils/demo/tramitesData";
import { uploadFile } from "../../../../firebase/config";
import SectionTitle from "example/components/Typography/SectionTitle";
import { ICategoriasData, convertJSONListCategory } from "utils/demo/categoriasData";
import { IStepRequirementData, convertJSONListRequirement } from "utils/demo/stepRequerimentData";

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

  var [serviceImg, setImg]: any = useState(null);

  const [categorias, setCategorias] = useState<ICategoriasData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const getActiveCategoriesRoute = "Categoria/getActiveCategorias"
  // ! Requisitos y pasos requisitos
  const [requisitos, setRequisitos] = useState<IStepRequirementData[]>([{ id: 0, description: '', pasosRequisito: [{ idStep: 0, nameStep: '' }] }]);

  const [agregarNuevoRequisito, setAgregarNuevoRequisito] = useState(true);

  const agregarRequisito = () => {
    if (agregarNuevoRequisito == true) {
      setRequisitos([...requisitos, { id: 0, description: '', pasosRequisito: [] }]);

    } else {
      setAgregarNuevoRequisito(true)
    }
  };

  const agregarPasoRequisito = (requisitoIndex: number, paso: { idStep: number, nameStep: string }) => {
    const nuevosPasosRequisitos = [...requisitos];

    nuevosPasosRequisitos[requisitoIndex].pasosRequisito.push(paso)
    setRequisitos(nuevosPasosRequisitos)
  };

  const eliminarPasoRequisito = (requisitoIndex: number, pasoIndex: number) => {
    const nuevosPasosRequisitos = [...requisitos];
    nuevosPasosRequisitos[requisitoIndex].pasosRequisito.splice(pasoIndex, 1);
    setAgregarNuevoRequisito(false)
    setRequisitos(nuevosPasosRequisitos);
  };

  const eliminarRequisito = (requisitoIndex: number) => {
    console.log("Indice de requisito a eliminar", requisitoIndex)
    const nuevosRequisitos = [...requisitos];

    nuevosRequisitos.splice(requisitoIndex, 1);
    setAgregarNuevoRequisito(false)
    setRequisitos(nuevosRequisitos);

  };


  const handleRequisitoChange = (e: any, index: any) => {
    const nuevosRequisistos = [...requisitos];
    nuevosRequisistos[index].description = e.target.value;
    setRequisitos(nuevosRequisistos);
  };


  const handlePasoRequisitoChange = (e: any, requisitoIndex: number, pasoIndex: number) => {
    const nuevosRequisitos = [...requisitos];
    const pasoActual = nuevosRequisitos[requisitoIndex].pasosRequisito[pasoIndex];
    pasoActual.nameStep = e.target.value;

    setRequisitos(nuevosRequisitos);
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
    console.log("location to delete: ", locationIndex)
    setLocations(nuevasLocation);
  }



  const [showAlert, setShowAlert] = useState<boolean>(false);


  const router = useRouter();
  const [service, setService] = useState<ITramitesData>();

  useEffect(() => {
    async function doFetch() {
      fetch(`${URLS.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => setService(convertJSONService(res.data[0])));
    }
    doFetch();


    async function fetchData() {
      fetch(`${URLS.baseUrl}${getActiveCategoriesRoute}`)
        .then((res) => res.json())
        .then((res) => setCategorias(convertJSONListCategory(res.data)));
    }
    fetchData();
  }, []);


  // Update Services 
  const updateServiceRoute = "Servicios/updateServicio/";
  const updateReferencesRoute = "Referencia/UpdateReferences/";
  const updateDurationServiceRoute = "Tramites/updateTramite/";
  const updateRequisitoRoute = "Requisitos/updateRequisito/";
  const getRequisitosByID = "Requisitos/getRequisitosByServiceId/";
  const deleteRequerimentRoute = "Requisitos/deleteRequisito/"
  const deleteStepRequerimentRoute = "Requisitos/deletePasoRequisito/"

  const createRequisitoRoute = "Requisitos/addRequisito";
  useEffect(() => {
    async function doFetch() {

      fetch(`${URLS.baseUrl}${getRequisitosByID}${id}`)
        .then((res) => res.json())
        .then((res) => setRequisitos(convertJSONListRequirement(res.data)));
    }
    doFetch();
  }, []);


  const [selectedRequeriment, setSelectedRequeriment] = useState<number>(0);
  const [selectedRequerimentsArray, setSelectedRequerimentsArray] = useState<number[]>([]);

  const [selectedStepRequeriment, setSelectedStepRequeriment] = useState<number>(0);

  const handleSubmit = async () => {
    try {
      const selectedCategoryId = selectedCategory;
      await fetch(`${URLS.baseUrl}${updateServiceRoute}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          //     imagenUrl: await uploadFile(serviceImg, "servicios/"),
          imageUrl: "",
          idCategoria: selectedCategoryId,

        }),
      });


      for (const requisito of requisitos) {
        if (requisito.description.trim() !== '') {
          const pasosFormateados = requisito.pasosRequisito.map((paso) => ({
            id: paso.idStep,
            nombre: paso.nameStep
          }));
          console.log("DATOS A ENVIAR", requisito.pasosRequisito)
          const updateRequisitoResponse = await fetch(`${URLS.baseUrl}${updateRequisitoRoute}${requisito.id}`, {

            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              descripcion: requisito.description,
              pasos: pasosFormateados,

            }),
          }
          );

          console.log("Respuesta del servidor al crear el requisito:", updateRequisitoResponse);

        }
      }


      
      //Filtrado de requisitos existentes en la DB
      const requisitosExistentes = await fetch(`${URLS.baseUrl}${getRequisitosByID}${id}`)
        .then((res) => res.json())
        .then((res) => convertJSONListRequirement(res.data));

      const nuevosRequisitosParaCrear = requisitos.filter((nuevoRequisito) => {
        return !requisitosExistentes.some((requisitoExistente: any) => {
          return nuevoRequisito.description === requisitoExistente.description &&
            nuevoRequisito.pasosRequisito == requisitoExistente.pasoRequisito;
        });
      });

      for (const nuevoRequisito of nuevosRequisitosParaCrear) {

        const pasosFormateados = nuevoRequisito.pasosRequisito.map((paso) => ({
          id: paso.idStep,
          nombre: paso.nameStep
        }));
        await fetch(`${URLS.baseUrl}${createRequisitoRoute}`, {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: nuevoRequisito.description,
            serviciosId: id,
            pasos: pasosFormateados,
            estado: true,
          }),
        });
      }

      await fetch(
        `${URLS.baseUrl}${updateReferencesRoute}${service?.enchargedId}`,
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

      await fetch(`${URLS.baseUrl}${updateDurationServiceRoute}${service?.durationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiempotramite: processingTime,
          serviciosId: id,
        }),
      });
      for (const selectedRequisitoId of selectedRequerimentsArray) {
        await fetch(`${URLS.baseUrl}${deleteRequerimentRoute}${selectedRequisitoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      await fetch(`${URLS.baseUrl}${deleteStepRequerimentRoute}${selectedStepRequeriment}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      //   router.reload();
    } catch (error) {
      console.error("Error al hacer el fetch:", error);
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


  const handleAlertCancel = () => {
    setShowAlert(false);
  };
  return (
    <Layout>
      <PageTitle>Editar tramite</PageTitle>
      <form id="miFormulario" onSubmit={handleSubmit}>

        <SectionTitle>Datos generales</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

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
            <span className=" text-lg">Imagen de referencia del tramite</span>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <span>Imagen Actual</span>
                  <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={serviceImg === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : service?.image}
                      alt="Imagen de Ubicación actual"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <span >Nueva Imagen</span>
                  <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
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
              className="mt-4"
              placeholder="Imagen del servicio"
              onChange={e => setImg(e.target.files?.[0] || null)}
            />
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
            <Select className="mt-1" onChange={(e) => setSelectedCategory(e.target.value)}>
              {categorias.map((categoria, i) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </Select>
          </Label>
        </div>

        <SectionTitle>Requisitos</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

          <Label>
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
                    onClick={() => agregarPasoRequisito(requisitoIndex, { idStep: 0, nameStep: '' })}
                  >
                    <PlusIcon />
                  </button>
                  <button
                    className="text-white px-2 py-1 rounded-full mr-2"
                    type="button"
                    onClick={() => {
                      eliminarRequisito(requisitoIndex);
                      //  setSelectedRequeriment(requisito.id)
                      setSelectedRequeriment(requisito.id)
                      setSelectedRequerimentsArray((prevArray) => [...prevArray, requisito.id])
                      console.log(selectedRequerimentsArray)
                    }}
                  >
                    <MinusIcon />
                  </button>
                  <Input
                    className="mt-1 mb-1"
                    placeholder="Ingresa el requisito"
                    value={requisito.description}
                    onChange={(e) => handleRequisitoChange(e, requisitoIndex)}
                  />

                </div>
                {requisito.pasosRequisito.map((paso, pasoIndex) => (
                  <div className="flex items-center ml-20" key={pasoIndex}>

                    <button
                      className="text-white px-2 py-1 rounded-full mr-2"
                      type="button"
                      onClick={() => {
                        setSelectedStepRequeriment(requisito.pasosRequisito[pasoIndex].idStep)
                        eliminarPasoRequisito(requisitoIndex, pasoIndex)
                      }

                      }
                    >
                      <MinusIcon />
                    </button>
                    <Input
                      className="mt-1 mb-1"
                      placeholder="Ingresa el paso del requisito"
                      value={paso.nameStep}
                      onChange={(e) => handlePasoRequisitoChange(e, requisitoIndex, pasoIndex)}
                    />

                  </div>
                ))}
              </div>
            ))}
          </Label>
        </div>

        <SectionTitle>Ubicaciones</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

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
        </div>

        <Label className="mt-4">
          <div className="relative text-gray-500 focus-within:text-purple-600">

            <button
              type={"button"}
              onClick={() => setShowAlert(true)}
              className="my-4 mb-6 px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Guardar
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
                ¿Confirma todos los datos del tramite?
              </SweetAlert>
            )}
          </div>
        </Label>
      </form >

    </Layout >
  );
}

export default ModificarTramite;
