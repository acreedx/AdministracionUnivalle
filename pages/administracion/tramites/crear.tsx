import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URLS from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";
import { ICategoriasData, convertJSONCategory, convertJSONListCategory } from "utils/demo/categoriasData";
import { uploadFile } from "../../../firebase/config";


function CrearTramite() {

  const [name, setname] = useState("");
  const [serviceImg, setImg]: any = useState(null);
  const [locationImg, setLocationImage]: any = useState(null);
  const [locationCroquisImg, setLocationCroquisImage]: any = useState(null);


  // ! Requisitos
  const [requisitos, setRequisitos] = useState<string[]>(['']);
  // ! Paso requisito
  const [pasoRequisito, setPasoRequisitos] = useState<Array<Array<string>>>([[]]);
  const [agregarNuevoRequisito, setAgregarNuevoRequisito] = useState(true);

  const agregarRequisito = () => {
    if (agregarNuevoRequisito == true) {
      // Agregar un nuevo requisito aquí, por ejemplo:
      setRequisitos([...requisitos, '']);

    } else {
      setAgregarNuevoRequisito(true)
    }
  };
  const agregarPasoRequisito = (requisitoIndex: number) => {
    const nuevosPasosRequisitos = [...pasoRequisito];

    if (!nuevosPasosRequisitos[requisitoIndex]) {
      nuevosPasosRequisitos[requisitoIndex] = [];
    }
    nuevosPasosRequisitos[requisitoIndex].push("");
    setPasoRequisitos(nuevosPasosRequisitos);
  };

  const eliminarPasoRequisito = (requisitoIndex: number, pasoIndex: number) => {
    const nuevosPasosRequisitos = [...pasoRequisito];
    nuevosPasosRequisitos[requisitoIndex].splice(pasoIndex, 1);
    setAgregarNuevoRequisito(false)
    setPasoRequisitos(nuevosPasosRequisitos);
  };

  const eliminarRequisito = (requisitoIndex: number) => {
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

   const handleLocationChange = (e: any, index: any) => {
    const nuevosLocalizaciones = [...locations];
    nuevosLocalizaciones[index] = e.target.value;
    setLocations(nuevosLocalizaciones);
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

  const [categorias, setCategorias] = useState<ICategoriasData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getActiveCategoriesRoute = "Categoria/getActiveCategorias"


  useEffect(() => {
    async function doFetch() {
      fetch(`${URLS.baseUrl}${getActiveCategoriesRoute}`)
        .then((res) => res.json())
        .then((res) => setCategorias(convertJSONListCategory(res.data)));
    }
    doFetch();
  }, []);

  const [showAlert, setShowAlert] = useState<boolean>(false);


  const router = useRouter();

  // Added Service 
  const createServiceRoute = "Servicios/addServicio";
  const createReferenceRoute = "Referencia/addReferences";
  const createDurationServiceRoute = "Tramites/addTramite";
  const createUbicacionRoute = "Ubicaciones/addUbicaciones";


  const moduleId = 3;

  const handleSubmit = async () => {
    try {
      const selectedCategoryId = selectedCategory;

      console.log(selectedCategoryId)
      const newService = await fetch(`${URLS.baseUrl}${createServiceRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          moduloId: moduleId,
          imageUrl: "",
          //      imagenUrl: await uploadFile(serviceImg, "servicios/"),
          idCategoria: selectedCategoryId
        }),
      });
      const dataNewService = await newService.json();
      const newServiceId = dataNewService.data.id;

      await createRequisitos(newServiceId);

      await createLocation(newServiceId);

      await fetch(`${URLS.baseUrl}${createReferenceRoute}`, {
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

      await fetch(`${URLS.baseUrl}${createDurationServiceRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiempotramite: processingTime,
          serviciosId: newServiceId,
        }),
      });
      router.push("/administracion/tramites")
    } catch (error) {
      console.error("Error al crear el servicio y requisitos:", error);
    }
  };

  //Added requeriment
  const createRequisitoRoute = "Requisitos/addRequisito";
  const createRequisitos = async (serviceId: number) => {
    for (let i = 0; i < requisitos.length; i++) {
      const requisito = requisitos[i];
      if (requisito.trim() !== '') {
        const nuevosPasos = pasoRequisito[i] ? pasoRequisito[i].map((nombre) => ({ nombre })) : [];
        console.log("Requisito a crear:", requisito, "Pasos:", nuevosPasos, "id", serviceId);

        const newRequisitoResponse = await fetch(`${URLS.baseUrl}${createRequisitoRoute}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: requisito,
            serviciosId: serviceId,
            id_modulo: 3,
            pasos: nuevosPasos,
            estado: true,
          }),
        });
        console.log("Respuesta del servidor al crear el requisito:", newRequisitoResponse);
      }
    }
  };


  const createLocation = async (serviceId: number) => {
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      if (location.trim() !== '') {
        const newLocationResponse = await fetch(`${URLS.baseUrl}${createUbicacionRoute}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagen: "",
            video: "",
            serviciosId: serviceId,
            estado: true,
          }),
        });

        console.log("Respuesta del servidor al crear la ubicacion:", newLocationResponse);
      }
    }
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
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
            <span>Nombre del tramite</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del tramite"
              onChange={(e) => setname(e.target.value)}
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
          <Label className="mt-4">
            <div className="flex items-center mt-4">
              <span className="mr-2">Requisitos</span>
              <button type="button" onClick={agregarRequisito}>
                <PlusIcon />
              </button>
            </div>

            {requisitos.map((requisito, requisitoIndex) => (
              <div key={requisitoIndex} className={requisitoIndex === requisitos.length - 1 ? 'hidden' : ''}>
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
                    key={`requisito-${requisitoIndex}`}
                  />
                </div>
                {pasoRequisito[requisitoIndex] && pasoRequisito[requisitoIndex].map((pasoRequisito, pasoIndex) => (
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
                      value={pasoRequisito}
                      onChange={(e) => handlePasoRequisitoChange(e, requisitoIndex, pasoIndex)}
                      key={`pasoRequisito-${requisitoIndex}-${pasoIndex}`}
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
              onChange={(e) => setprocessingTime(e.target.value)}
            />
          </Label>

          <Label className="mt-4">
            <span>Encargado</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre completo del encargado"
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
            <span>Seleccione una categoria de tramite</span>
            <Select className="mt-1" onChange={(e) => setSelectedCategory(e.target.value)}>
              {categorias.map((categoria, i) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </Select>
          </Label>


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
                    value={location}
                    onChange={(e) => handleLocationChange(e, locationIndex)}
                    key={`locations-${locationIndex}`}
                  />
                </div>

                <div className="flex justify-center space-x-20 mb-2">
                  <Label className="mt-4">
                    <span>Imagen de la ubicación del lugar</span>
                    <Input
                      type="file"
                      className="mt-1"
                      placeholder="Imagen para ubicación"
                      onChange={(e) => setLocationImage(e.target.files?.[0] || null)}
                    />
                  </Label>
                  <Label className="mt-4">
                    <span>Croquis de la ubicación del lugar</span>
                    <Input
                      type="file"
                      className="mt-1"
                      placeholder="Imagen para ubicación"
                      onChange={(e) => setLocationCroquisImage(e.target.files?.[0] || null)}
                    />
                  </Label>
                </div>
              </div>
            ))}
          </Label>

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
