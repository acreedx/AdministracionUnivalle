import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";
import { ICategoriasData, convertJSONCategory, convertJSONListCategory } from "utils/demo/categoriasData";


function CrearTramite() {

  const [name, setname] = useState("");

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
      fetch(`${URL.baseUrl}${getActiveCategoriesRoute}`)
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
  const moduleId = 3;

  const handleSubmit = async () => {
    try {
      const selectedCategoryId = selectedCategory;
      console.log(selectedCategoryId)
      const newService = await fetch(`${URL.baseUrl}${createServiceRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          moduloId: moduleId,
          imagenUrl: "",
          //  idCategoria: selectedCategoryId
        }),
      });
      const dataNewService = await newService.json();
      const newServiceId = dataNewService.data.id;

      await createRequisitos(newServiceId);

      await fetch(`${URL.baseUrl}${createReferenceRoute}`, {
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

      await fetch(`${URL.baseUrl}${createDurationServiceRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiempotramite: processingTime,
          serviciosId: newServiceId,
        }),
      });

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

        const newRequisitoResponse = await fetch(`${URL.baseUrl}${createRequisitoRoute}`, {
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


  const handleAlertConfirm = () => {
    // handleSubmit();
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

export default CrearTramite;
