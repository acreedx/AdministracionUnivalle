import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URLS from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";
import { ICategoriasData, convertJSONListCategory } from "utils/demo/categoriasData";
import { uploadFile } from "../../../firebase/config";
import existingLocations from "../../../utils/dataTools/existingLocations";
import SectionTitle from "example/components/Typography/SectionTitle";
import tramitesProvider from "utils/providers/tramitesProvider";
import LoadingScreen from "example/components/loading-screen";
import Loading from "./loading";
import { ITramitesData, convertJSONListService } from "utils/demo/tramitesData";



function CrearTramite() {

  const [name, setname] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [requisitoError, setRequisitoError] = useState<boolean>(false);
  const [cellphoneError, setCellphoneError] = useState<string | null>(null);
  const [showAlertLoading, setShowAlertLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false)
  const [serviceImg, setImg]: any = useState(null);
  const [locationImg, setLocationImage] = useState<string[]>([]);
  const [locationCroquisImg, setLocationCroquisImage] = useState<string[]>([]);
  const [valueNewLocation, setValueNewLocation] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>(['']);
  const [fileLocationImg, setfileLocationImg]: any = useState<any[]>([]);
  const [fileCroquisImg, setfileCroquisImg]: any = useState<any[]>([]);
  const [services, setServices] = useState<ITramitesData[]>([]);
  const routeTramitesActives = "Servicios/getTramiteByModuleActive/";
  const moduleName = "Tramites";
  const handleCreateValueNewLocation = (value: string) => {
    // Crear una nueva copia del array y agregar el nuevo valor
    const updatedValueLocation = [...valueNewLocation, value];

    // Actualizar el estado con la nueva copia del array
    setValueNewLocation(updatedValueLocation);
  };
  const handleChangeValueNewLocationByInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    // Crear una copia del array y modificar la copia
    const updatedValueNewLocation = [...valueNewLocation];
    updatedValueNewLocation[index] = e.target.value;

    // Actualizar el estado con la nueva copia del array
    setValueNewLocation(updatedValueNewLocation);
  };
  const handleDeleteElementNewLocation = (index: number) => {
    // Crea un nuevo array excluyendo el elemento en el índice proporcionado
    const updatedValueLocation = valueNewLocation.filter((_, i) => i !== index);

    // Actualiza el estado con el nuevo array
    setValueNewLocation(updatedValueLocation);
  };
  const handleCreateLocationImg = (value: string) => {
    // Crear una nueva copia del array y agregar el nuevo valor
    const updatedValueLocationImg = [...locationImg, value];

    // Actualizar el estado con la nueva copia del array
    setLocationImage(updatedValueLocationImg);
  };
  const handleChangeLocationImg = (value: string, index: number) => {
    // Crear una copia del array y modificar la copia
    const updatedLocationImg = [...locationImg];
    updatedLocationImg[index] = value;

    // Actualizar el estado con la nueva copia del array
    setLocationImage(updatedLocationImg);
  };
  const handleDeleteLocationImg = (index: number) => {
    // Crea un nuevo array excluyendo el elemento en el índice proporcionado
    const updatedValueLocationImg = locationImg.filter((_, i) => i !== index);

    // Actualiza el estado con el nuevo array
    setLocationImage(updatedValueLocationImg);
  };
  const handleCreateLocationCroquisImg = (value: string) => {
    // Crear una nueva copia del array y agregar el nuevo valor
    const updatedValueLocationCroquisImg = [...locationCroquisImg, value];

    // Actualizar el estado con la nueva copia del array
    setLocationCroquisImage(updatedValueLocationCroquisImg);
  };
  const handleChangeLocationCroquisImg = (value: string, index: number) => {
    // Crear una copia del array y modificar la copia
    const updatedLocationCroquisImg = [...locationCroquisImg];
    updatedLocationCroquisImg[index] = value;

    // Actualizar el estado con la nueva copia del array
    setLocationCroquisImage(updatedLocationCroquisImg);
  };
  const handleDeleteLocationCroquisImg = (index: number) => {
    // Crea un nuevo array excluyendo el elemento en el índice proporcionado
    const updatedValueLocationCroquisImg = locationCroquisImg.filter((_, i) => i !== index);

    // Actualiza el estado con el nuevo array
    setLocationCroquisImage(updatedValueLocationCroquisImg);
  };
  const handleCreateFileLocationImg = (value: any) => {
    // Crear una nueva copia del array y agregar el nuevo valor
    const updatedFileLocationImg = [...fileLocationImg, value];

    // Actualizar el estado con la nueva copia del array
    setfileLocationImg(updatedFileLocationImg);
  };
  const handleChangeFileLocationImg = (value: any, index: number) => {
    // Crear una copia del array y modificar la copia
    const updatedFileLocationImg = [...fileLocationImg];
    updatedFileLocationImg[index] = value;

    // Actualizar el estado con la nueva copia del array
    setfileLocationImg(updatedFileLocationImg);
  };
  const handleDeleteFileLocationImg = (index: number) => {
    // Crea un nuevo array excluyendo el elemento en el índice proporcionado
    const updatedFileLocationImg = fileLocationImg.filter((_: any, i: number) => i !== index);

    // Actualiza el estado con el nuevo array
    setfileLocationImg(updatedFileLocationImg);
  };
  const handleCreateFileCroquisImg = (value: any) => {
    // Crear una nueva copia del array y agregar el nuevo valor
    const updatedFileCroquisImg = [...fileCroquisImg, value];

    // Actualizar el estado con la nueva copia del array
    setfileCroquisImg(updatedFileCroquisImg);
  };
  const handleChangeFileCroquisImg = (value: any, index: number) => {
    // Crear una copia del array y modificar la copia
    const updatedFileCroquisImg = [...fileCroquisImg];
    updatedFileCroquisImg[index] = value;

    // Actualizar el estado con la nueva copia del array
    setfileCroquisImg(updatedFileCroquisImg);
  };
  const handleDeleteFileCroquisImg = (index: number) => {
    // Crea un nuevo array excluyendo el elemento en el índice proporcionado
    const updatedFileCroquisImg = fileCroquisImg.filter((_: any, i: number) => i !== index);

    // Actualiza el estado con el nuevo array
    setfileCroquisImg(updatedFileCroquisImg);
  };
  const handleSetCommonLocationImg = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    for (let i = 0; i < existingLocations.length; i++) {
      const element = existingLocations[i].name;
      if (e.target.value == element) {
        handleChangeLocationImg(existingLocations[i].locationIMG, index)
        console.log(locationCroquisImg)
      }
    }
  };
  const handleSetCommonLocationCroquisImg = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    for (let i = 0; i < existingLocations.length; i++) {
      const element = existingLocations[i].name;
      if (e.target.value == element) {
        handleChangeLocationCroquisImg(existingLocations[i].croquis, index)
        //setLocationCroquisImage(existingLocations[i].croquis)
        console.log(locationCroquisImg)
      }
    }

  };
  const agregarLocation = () => {
    setLocations([...locations, '']);
    handleCreateValueNewLocation("")
    handleCreateLocationImg("")
    handleCreateLocationCroquisImg("")
    handleCreateFileLocationImg("")
    handleCreateFileCroquisImg("")
  }
  const eliminarLocation = (locationIndex: number) => {
    const nuevasLocation = [...locations];
    nuevasLocation.splice(locationIndex, 1);
    console.log("location a eliminar: ", locationIndex)
    setLocations(nuevasLocation);
    handleDeleteElementNewLocation(locationIndex)
    handleDeleteLocationImg(locationIndex)
    handleDeleteLocationCroquisImg(locationIndex)
    handleDeleteFileLocationImg(locationIndex)
    handleDeleteFileCroquisImg(locationIndex)
  }
  const handleChangeLocationImgByInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const archivo = e.target.files?.[0];
    handleChangeFileLocationImg(archivo, index)
    if (archivo) {
      const lector = new FileReader();
      lector.onload = (e) => {
        const result = e.target?.result
        if (result)
          handleChangeLocationImg(result as string, index);
      };
      lector.readAsDataURL(archivo);
    }
  };
  const handleChangeLocationCroquisImgByInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const archivo = e.target.files?.[0];
    handleChangeFileCroquisImg(archivo, index)
    if (archivo) {
      const lector = new FileReader();
      lector.onload = (e) => {
        const result = e.target?.result
        if (result)
          handleChangeLocationCroquisImg(result as string, index);
      };
      lector.readAsDataURL(archivo);
    }
  };

  // ! Requisitos
  const [requisitos, setRequisitos] = useState<string[]>(['']);
  // ! Paso requisito
  const [pasoRequisito, setPasoRequisitos] = useState<Array<Array<string>>>([[]]);
  const [agregarNuevoRequisito, setAgregarNuevoRequisito] = useState(true);

  const agregarRequisito = () => {
    if (agregarNuevoRequisito == true) {
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
  const handleRequisitoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value;
    // Utiliza una expresión regular para verificar si contiene solo letras, números y punto.
    //const containsValidChars = /^[a-zA-Z0-9.,]*$/.test(inputValue);
    const containsValidChars = /^[a-zA-Z0-9.,\s]*$/.test(inputValue);

    if (containsValidChars) {
      const nuevosRequisitos = [...requisitos];
      nuevosRequisitos[index] = inputValue;
      setRequisitos(nuevosRequisitos);
      setRequisitoError(false); // Limpia el estado de error si contiene caracteres válidos.
    } else {
      setRequisitoError(true); // Establece el estado de error si contiene caracteres no válidos.
    }
  };

  const handlePasoRequisitoChange = (e: any, requisitoIndex: number, pasoIndex: number) => {
    const nuevosPasosRequisitos = [...pasoRequisito];
    nuevosPasosRequisitos[requisitoIndex][pasoIndex] = e.target.value;
    setPasoRequisitos(nuevosPasosRequisitos);
  };

  const [encharged, setencharged] = useState("");
  const [cellphone, setcellphone] = useState("");
  const [durationNumber, setDurationNumber] = useState("");
  const [durationSelect, setDurationSelect] = useState("horas");
  const [categorias, setCategorias] = useState<ICategoriasData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("19");
  const getActiveCategoriesRoute = "Categoria/getActiveCategorias"

  useEffect(() => {
    const requisitosToAdd = requisitos.map((requisito, index) => ({
      descripcion: requisito,
      pasos: pasoRequisito[index] ? pasoRequisito[index].map(nombre => ({ nombre })) : [],

    }));

    console.log("Format requisitos", requisitosToAdd)
    async function doFetch() {
      fetch(`${URLS.baseUrl}${getActiveCategoriesRoute}`)
        .then((res) => res.json())
        .then((res) => setCategorias(convertJSONListCategory(res.data)));
    }
    doFetch();

    async function ListTramites() {
      fetch(`${URLS.baseUrl}${routeTramitesActives}${moduleName}`)
        .then((res) => res.json())
        .then((res) => setServices(convertJSONListService(res.data)));
    }
    ListTramites();
  }, []);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const router = useRouter();

  const createUbicacionRoute = "Ubicaciones/addUbicaciones";

  const moduleId = 3;
  const [loading, setLoading] = useState(true);
  const handleSubmit = async () => {

    if (
      name.trim() === "" ||
      serviceImg === null ||
      cellphone.trim() === "" ||
      durationNumber.trim() === "" ||
      selectedCategory === "" ||
      encharged.trim() === ""
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setShowAlertLoading(true);
    setIsSuccess(false);

    try {
      setLoading(true);

      console.log(name, moduleId, encharged, selectedCategory, cellphone)
      const serviceId = await tramitesProvider.CreateTramite(
        name,
        moduleId,
        await uploadFile(serviceImg, "servicios/"),
        selectedCategory,
        encharged,
        cellphone,
        `${durationNumber} ${durationSelect}`
      );
      console.log(serviceId);
      await createRequisitos(serviceId);
      await createLocation(serviceId);


      setIsSuccess(true);
    } catch (error) {
      console.error("Error al crear el servicio y requisitos:", error);
    } finally {
      setLoading(false);
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
    //console.log(locationImg)
    for (let i = 0; i < locationImg.length; i++) {
      const location = locationImg[i];
      //console.log(location)
      var imgURL
      if (location.includes("data:")) {
        //console.log(fileLocationImg[i])
        imgURL = await uploadFile(fileLocationImg[i], "ubicacionesTramites/")
      }
      else
        imgURL = locationImg[i]
      const croquis = locationCroquisImg[i];
      var croquisURL
      //console.log(location)
      if (croquis.includes("data:")) {
        //console.log(fileLocationImg[i])
        croquisURL = await uploadFile(fileCroquisImg[i], "ubicacionesTramites/")
      }
      else
        croquisURL = locationCroquisImg[i]
      //console.log(imgURL)
      if (location.trim() !== '') {
        const newLocationResponse = await fetch(`${URLS.baseUrl}${createUbicacionRoute}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: valueNewLocation[i],
            imagen: imgURL,
            video: croquisURL,
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
  const handleAlertLoadConfirm = () => {
    router.push("/administracion/tramites")
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const inputValue = e.target.value;
    const containsInvalidChars = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputValue);
    const tramiteExists = services.some((tramite) => tramite.name === inputValue);

    if (!containsInvalidChars && !tramiteExists) {
      setname(inputValue);
      setNameError("");
    } else {
      setNameError("No se permiten números o caracteres especiales.");

      if (tramiteExists) {
        setNameError("El nombre del tramite ya está en uso. Por favor, elige otro nombre.");
      }
    }
  };

  /*
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const containsInvalidChars = /[^a-zA-Z\s\d.]/.test(inputValue);

    if (containsInvalidChars) {
      setNameError("No se permiten números o caracteres especiales.");
    } else {
      setNameError(null); // Limpiar el mensaje de error si el valor es válido.
    }

    setname(inputValue);
  };
*/
  const handleCellphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Utiliza una expresión regular para verificar si solo contiene dígitos.
    const isValidPhoneNumber = /^[0-9]{7,8}$/.test(inputValue);

    if (!isValidPhoneNumber) {
      setCellphoneError("El número de teléfono debe tener 8 dígitos y solo contener números.");
    } else {
      setCellphoneError(null); // Limpia el mensaje de error si todo está bien.
    }

    setcellphone(inputValue);
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <PageTitle>Crear un tramite</PageTitle>
      <form id="miFormulario" onSubmit={handleSubmit}>
        <SectionTitle>Datos generales</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

          <Label>
            <span>Nombre del trámite</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del trámite"
              value={name}
              onChange={(e) => handleNameChange(e)}
            />
          </Label>
          {nameError && <span className="text-red-500">{nameError}</span>}


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
              accept=".png, .jpg, .jpeg"
              className="mt-1"
              placeholder="Imagen para el servicio"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  const fileName = selectedFile.name;
                  const validExtensions = /\.(png|jpg|jpeg)$/i; // Expresión regular para verificar la extensión

                  if (validExtensions.test(fileName)) {
                    setImg(selectedFile);
                  } else {
                    alert("Por favor, seleccione un archivo de imagen con extensión .png, .jpg o .jpeg");
                  }
                } else {
                  setImg(null);
                }
              }}
            />

          </Label>
          <Label className="mt-4 ">
            <span>Duracion del tramite</span>
            <div className="flex justify-start">

              <Input
                className="mt-1"
                type="number"
                min={1}
                placeholder="Tiempo"
                onChange={(e) => setDurationNumber(e.target.value)}
              />

              <Select className="mt-1" onChange={(e) => setDurationSelect(e.target.value)}>
                <option>
                  horas
                </option>
                <option>
                  dias
                </option>
                <option>
                  semanas
                </option>
                <option>
                  meses
                </option>

              </Select>

            </div>
          </Label>
          <Label className="mt-4">
            <span>Encargado</span>
            <Input
              className={`mt-1 ${/[^A-Za-z\s]/.test(encharged) ? 'border-red-500' : ''}`}
              placeholder="Ingresa el nombre completo del encargado"
              onChange={(e) => setencharged(e.target.value)}
            />
            {/[^A-Za-z\s]/.test(encharged) && (
              <span className="text-red-500">No se permiten números ni caracteres especiales.</span>
            )}
          </Label>
          <Label className="mt-4">
            <span>Teléfono de referencia</span>
            <Input
              className={`mt-1 ${cellphoneError ? 'border-red-500' : ''}`}
              placeholder="Ingresa el teléfono de referencia del encargado"
              value={cellphone}
              onChange={handleCellphoneChange}
            />
            {cellphoneError && <span className="text-red-500">{cellphoneError}</span>}
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
                    className={`mt-1 mb-1 ${requisitoError ? 'border-red-500' : ''}`}
                    placeholder="Ingresa el requisito"
                    value={requisito}
                    onChange={(e) => handleRequisitoChange(e, requisitoIndex)}
                    key={`requisito-${requisitoIndex}`}
                  />
                  {requisitoError && (
                    <span className="text-red-500">No se permiten números o caracteres especiales.</span>
                  )}
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
                    id={locationIndex.toString()}
                    list={"Locations" + locationIndex.toString()}
                    type="text"
                    placeholder="Ingrese la ubicación del servicio"
                    value={valueNewLocation[locationIndex]}
                    onChange={(e) => {
                      handleChangeValueNewLocationByInput(e, locationIndex)
                      if (!locationImg[locationIndex].includes("data:"))
                        handleSetCommonLocationImg(e, locationIndex)
                      if (!locationCroquisImg[locationIndex].includes("data:"))
                        handleSetCommonLocationCroquisImg(e, locationIndex)
                      //console.log(locationImg)
                      //console.log(locationCroquisImg[locationIndex].includes("data:"))
                      console.log(fileLocationImg)
                    }}
                  />
                  <datalist id={"Locations" + locationIndex.toString()}>
                    {existingLocations.map((existingLocation, i) => (
                      <option
                        key={existingLocation.id}
                        value={existingLocation.name}
                        id={
                          existingLocation.locationIMG
                          + ".-.-." + existingLocation.croquis
                          + ".-.-." + existingLocation.name}
                      >
                        ubicacion común
                      </option>
                    ))}
                  </datalist>

                </div>

                <div className="flex justify-center space-x-10 mb-2">
                  <Label className="mt-4">
                    <span>Imagen de la ubicación del lugar</span>
                    <Input
                      type="file"
                      className="mt-1"
                      placeholder="Imagen para ubicación"
                      onChange={(e) => handleChangeLocationImgByInput(e, locationIndex)}
                    />
                  </Label>

                  <Label className="mt-4">
                    <span>Croquis de la ubicación del lugar</span>
                    <Input
                      type="file"
                      className="mt-1"
                      placeholder="Imagen para ubicación"
                      onChange={(e) => handleChangeLocationCroquisImgByInput(e, locationIndex)}
                    />
                  </Label>

                </div>
                <div className="flex justify-center space-x-10 mb-2 h-60 ">
                  <img className="" src={locationImg[locationIndex]} width="300rem" />
                  <img className="" src={locationCroquisImg[locationIndex]} width="300rem" />
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
                Confirma todos los datos del nuevo servicio?
              </SweetAlert>
            )}
            {showAlertLoading && (
              isSuccess ? (
                <SweetAlert
                  success
                  title="¡Éxito!"
                  onConfirm={handleAlertLoadConfirm}
                >
                  Los datos han sido enviados con éxito.
                </SweetAlert>
              ) :
                (
                  <SweetAlert
                    title="Cargando..."
                    onConfirm={handleAlertConfirm}
                    confirmBtnText={""}
                    custom
                  >
                    <div className="-my-56">
                      <Loading />
                    </div>
                    Enviando los datos espere....
                  </SweetAlert>
                )

            )}

          </div>
        </Label>
      </form>

    </Layout >
  );
}


export default CrearTramite;
