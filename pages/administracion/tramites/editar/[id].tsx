import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URLS from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusIcon, MinusIcon } from "icons";
import { GetServerSidePropsContext } from "next";
//import { ITramitesData, convertJSONService } from "utils/demo/tramitesData";
import { ITramitesDataEdit, convertJSONService } from "utils/demo/tramitesDataEdit";
import { uploadFile } from "../../../../firebase/config";
import SectionTitle from "example/components/Typography/SectionTitle";
import { ICategoriasData, convertJSONListCategory } from "utils/demo/categoriasData";
import { IStepRequirementData, convertJSONListRequirement } from "utils/demo/stepRequerimentData";
import { ILocationData, convertJSONListLocation } from "utils/demo/locationData";
import existingLocations from "../../../../utils/dataTools/existingLocations";
import Loading from "../loading";

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
  const [nameError, setNameError] = useState<string | null>(null);
  const [requisitoError, setRequisitoError] = useState<boolean>(false);
  const [enchargedError, setEnchargedError] = useState<string | null>(null);
  const [cellphoneError, setCellphoneError] = useState<string | null>(null);

  const [durationSelect, setDurationSelect] = useState("");
  var [serviceImg, setImg]: any = useState(null);

  const [categorias, setCategorias] = useState<ICategoriasData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const getActiveCategoriesRoute = "Categoria/getActiveCategorias"

  //Ubicaciones
  const createUbicacionRoute = "Ubicaciones/addUbicaciones";
  const updateUbicacionRoute = "Ubicaciones/updateUbicaciones/";
  const deleteUbicacionRoute = "Ubicaciones/deleteUbicacion/";
  const [locationImg, setLocationImage] = useState<string[]>([]);
  const [locationCroquisImg, setLocationCroquisImage] = useState<string[]>([]);
  const [valueNewLocation, setValueNewLocation] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>(['']);
  const [fileLocationImg, setfileLocationImg]: any = useState<any[]>([]);
  const [fileCroquisImg, setfileCroquisImg]: any = useState<any[]>([]);

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
    console.log(valueNewLocation.length);
    console.log(ubicaciones.length);
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
    console.log(valueNewLocation.length);
    console.log(ubicaciones.length);
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



  const updateLocation = async (serviceId: number) => {
    if (valueNewLocation.length <= ubicaciones.length) {
      for (let i = 0; i < ubicaciones.length; i++) {
        
        const element = ubicaciones[i];
        
        if(i+1 > valueNewLocation.length)
        {
          console.log("a")
          const newDeleteLocationResponse = await fetch(`${URLS.baseUrl}${deleteUbicacionRoute}${element.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: ""
          });
          console.log("Respuesta del servidor al actualizar la ubicacion:", newDeleteLocationResponse);
        }
        else 
        {
          const location = locationImg[i];
          const croquis = locationCroquisImg[i];
          var imgURL
          var croquisURL
  
          if (location.includes("data:")) imgURL = await uploadFile(fileLocationImg[i], "ubicacionesTramites/")
          else imgURL = locationImg[i]
  
          if (croquis.includes("data:")) croquisURL = await uploadFile(fileCroquisImg[i], "ubicacionesTramites/")
          else croquisURL = locationCroquisImg[i]
          if (location.trim() !== '') 
          {
            const newLocationResponse = await fetch(`${URLS.baseUrl}${updateUbicacionRoute}${element.id}`, {
              method: "PUT",
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
  
            console.log("Respuesta del servidor al actualizar la ubicacion:", newLocationResponse);
          }
        }
      }
      //setUbicacionesActualizadas((prev) => [...prev, ...nuevasUbicaciones]);
    }
    else
    {
      for (let i = 0; i < valueNewLocation.length; i++) {
        if(i < ubicaciones.length)
        {
          const element = ubicaciones[i];
          const location = locationImg[i];
          const croquis = locationCroquisImg[i];
          var imgURL
          var croquisURL
  
          if (location.includes("data:")) imgURL = await uploadFile(fileLocationImg[i], "ubicacionesTramites/")
          else imgURL = locationImg[i]
  
          if (croquis.includes("data:")) croquisURL = await uploadFile(fileCroquisImg[i], "ubicacionesTramites/")
          else croquisURL = locationCroquisImg[i]
          if (location.trim() !== '') 
          {
            const newLocationResponse = await fetch(`${URLS.baseUrl}${updateUbicacionRoute}${element.id}`, {
              method: "PUT",
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
  
            console.log("Respuesta del servidor al actualizar la ubicacion:", newLocationResponse);
          }
        }
        else 
        {
          const location = locationImg[i];
          var imgURL
          if (location.includes("data:")) imgURL = await uploadFile(fileLocationImg[i], "ubicacionesTramites/")
          else imgURL = locationImg[i]
          const croquis = locationCroquisImg[i];
          var croquisURL
          if (croquis.includes("data:")) {
            croquisURL = await uploadFile(fileCroquisImg[i], "ubicacionesTramites/")
          }
          else
            croquisURL = locationCroquisImg[i]
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
      }
    }
  };

  // ! Requisitos y pasos requisitos
  const [requisitos, setRequisitos] = useState<IStepRequirementData[]>([{ id: 0, description: '', pasosRequisito: [{ idStep: 0, nameStep: '' }] }]);
  const [ubicaciones, setUbicaciones] = useState<ILocationData[]>([]);
  const [ubicacionesActualizadas, setUbicacionesActualizadas] = useState<ILocationData[]>([]);

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
  const handleRequisitoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value;
    // Utiliza una expresión regular para verificar si contiene números o caracteres especiales.
    const containsInvalidChars = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputValue);

    if (containsInvalidChars) {
      setRequisitoError(true); // Establece el estado de error si contiene caracteres no válidos.
    } else if (inputValue.trim() === '') {
      setRequisitoError(true); // Establece el estado de error si el campo está vacío.
    } else {
      const nuevosRequisitos = [...requisitos];
      nuevosRequisitos[index] = { ...nuevosRequisitos[index], description: inputValue }; // Actualiza solo la descripción del requisito.
      setRequisitos(nuevosRequisitos);
      setRequisitoError(false); // Limpia el estado de error si no contiene caracteres no válidos y no está vacío.
    }
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
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showAlertLoading, setShowAlertLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter();
  const [service, setService] = useState<ITramitesDataEdit>();

  useEffect(() => {
    async function doFetch() {
      fetch(`${URLS.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => {
          setService(convertJSONService(res.data[0]))
          console.log(res)
        });
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
  const getUbicacionesByID = "Ubicaciones/getUbicacionesbyServicioId/";
  const deleteRequerimentRoute = "Requisitos/deleteRequisito/"
  const deleteStepRequerimentRoute = "Requisitos/deletePasoRequisito/"
  const getPasosRequisitosByServiceIdRoute = "PasosRequisitos/getPasosRequisitosByServiceId?id="
  const getPasosRequisitosByRequisitoId = "PasosRequisitos/getPasosRequisitosByRequisitoId/"

  const createRequisitoRoute = "Requisitos/addRequisito";
  const createStepRequerimentRoute = "PasosRequisitos/addPasoRequisito";
  useEffect(() => {
    //Requisitos
    async function doFetch() {
      fetch(`${URLS.baseUrl}${getRequisitosByID}${id}`)
        .then((res) => res.json())
        .then((res) => setRequisitos(convertJSONListRequirement(res.data)));
    }
    doFetch();
  }, []);

  useEffect(() => {
    //Ubicaciones
    async function doFetchUbicaciones() {
      fetch(`${URLS.baseUrl}${getUbicacionesByID}${id}`)
        .then((res) => res.json())
        .then((res) => setUbicaciones(convertJSONListLocation(res.data)));
    }
    doFetchUbicaciones()
  }, []);

  useEffect(() => {
    //console.log(ubicaciones)
    for (let i = 0; i < ubicaciones.length; i++) {
      const element = ubicaciones[i];
      if (!element.description.includes("CROQUIS")) {
        setLocations(prevValue => [...prevValue, ""])
        setValueNewLocation(prevValue => [...prevValue, element.description]);
        setLocationImage(prevValue => [...prevValue, element.img]);
        setLocationCroquisImage(prevValue => [...prevValue, element.croquis]);
      }

    }
  }, [ubicaciones]);


  const [selectedRequeriment, setSelectedRequeriment] = useState<number>(0);
  const [selectedRequerimentsArray, setSelectedRequerimentsArray] = useState<number[]>([]);

  const [selectedStepRequeriment, setSelectedStepRequeriment] = useState<number>(0);
  const [selectedStepRequerimentsArray, setSelectedStepRequerimentsArray] = useState<number[]>([]);

  const handleSubmit = async () => {
    setShowAlertLoading(true)
    setIsSuccess(false)
    try {

      const selectedCategoryId = selectedCategory;
      await fetch(`${URLS.baseUrl}${updateServiceRoute}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          imagenUrl: await uploadFile(serviceImg, "servicios/"),
          idCategoria: selectedCategoryId,

        }),
      });

      await updateLocation(id);
      
      

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

      const requisitosExistentes = await fetch(`${URLS.baseUrl}${getRequisitosByID}${id}`)
        .then((res) => res.json())
        .then((res) => convertJSONListRequirement(res.data));

      for (const requisito of requisitos) {
        const pasosRequisitosExistentes = await getPasosRequisitosByRequisitoIdF(requisito.id);

        const nuevosPasosParaCrear = requisito.pasosRequisito.filter((nuevoPaso) => {
          // Si no hay pasos existentes, incluye todos los nuevos pasos
          if (pasosRequisitosExistentes === null) {
            return true;
          }

          // Si hay pasos existentes, verifica si el nuevo paso ya está incluido
          return !pasosRequisitosExistentes.some((pasoExistente: any) => {
            return nuevoPaso.nameStep === pasoExistente.nombre;
          });
        });



        for (const nuevoPaso of nuevosPasosParaCrear) {
          await fetch(`${URLS.baseUrl}${createStepRequerimentRoute}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: nuevoPaso.nameStep,
              requisitoId: requisito.id,
            }),
          })
            .then(response => response.json())
            .then(data => {
              console.log("Paso creado exitosamente", data);
            })
            .catch(error => {
              console.error("Error al crear el paso", error);
            });
        }
      }

      const nuevosRequisitosParaCrear = requisitos.filter((nuevoRequisito) => {
        return !requisitosExistentes.some((requisitoExistente: any) => {
          return nuevoRequisito.description === requisitoExistente.description
        })
      });

      for (const nuevoRequisito of nuevosRequisitosParaCrear) {
        console.log("DATOS A ENVIAR nuevosRequisitos", nuevoRequisito.pasosRequisito)
        await fetch(`${URLS.baseUrl}${createRequisitoRoute}`, {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: nuevoRequisito.description,
            serviciosId: id,

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
          tiempotramite: `${processingTime} ${durationSelect}`,
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
      for (const selectedPasoRequisitoId of selectedStepRequerimentsArray) {
        await fetch(`${URLS.baseUrl}${deleteStepRequerimentRoute}${selectedPasoRequisitoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      setIsSuccess(true)
      //  router.push("/administracion/tramites")
    } catch (error) {
      console.error("Error al hacer el fetch:", error);
    }
  };


  const getPasosRequisitosByRequisitoIdF = async (RequisitoId: number) => {
    return await fetch(`${URLS.baseUrl}${getPasosRequisitosByRequisitoId}${RequisitoId}`)
      .then((res) => res.json())
      .then((res) => res.data);
  }
  const handleAlertConfirm = () => {
    setShowAlert(false);
    setShowAlertLoading(false)
    handleSubmit();
  };

  useEffect(() => {
    if (service?.name) {
      setname(service!.name);
      const [numberPart, selectPart] = service!.duration.split(' ');
      setprocessingTime(numberPart);
      setDurationSelect(selectPart);

      setencharged(service!.encharged);
      setcellphone(service!.cellphone);
    }
  }, [service]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const containsInvalidChars = /[^a-zA-Z\s]/.test(inputValue);

    if (containsInvalidChars) {
      setNameError("No se permiten números o caracteres especiales.");
    } else if (inputValue.trim() === '') {
      setNameError("El nombre del trámite no puede estar vacío.");
    } else {
      setNameError(null); // Limpiar el mensaje de error si el valor es válido.
    }

    setname(inputValue);
  };

  const handleEnchargedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Utiliza una expresión regular para verificar si contiene números o caracteres especiales.
    const containsInvalidChars = /[^a-zA-Z\s]/.test(inputValue);

    if (containsInvalidChars) {
      setEnchargedError("No se permiten números ni caracteres especiales.");
    } else if (inputValue.trim() === '') {
      setEnchargedError("Este campo no puede estar vacío.");
    } else {
      setEnchargedError(null); // Limpia el mensaje de error si todo está bien.
    }

    setencharged(inputValue);
  };

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
  const handleAlertLoadConfirm = () => {
    router.push("/administracion/tramites")
  };
  return (
    <Layout>
      <PageTitle>Editar tramite</PageTitle>
      <form id="miFormulario" onSubmit={handleSubmit}>

        <SectionTitle>Datos generales</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

          <Label>
            <span>Nombre del trámite</span>
            <Input
              className={`mt-1 ${nameError ? 'border-red-500' : ''}`}
              placeholder="Ingresa el nombre del trámite"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && <span className="text-red-500">{nameError}</span>}
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
                      src={service?.image}
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
            <div className="flex justify-start">
              <Input
                className="mt-1"
                placeholder="Ingresa la duracion del tramite"
                value={processingTime}
                onChange={(e) => setprocessingTime(e.target.value)}
              />

              <Select
                className="mt-1"
                value={durationSelect}
                onChange={(e) => setDurationSelect(e.target.value)}
              >
                <option value="horas">horas</option>
                <option value="dias">dias</option>
                <option value="semanas">semanas</option>
                <option value="meses">meses</option>
              </Select>
            </div>
          </Label>

          <Label className="mt-4">
            <span>Encargado</span>
            <Input
              className={`mt-1 ${enchargedError ? 'border-red-500' : ''}`}
              placeholder="Ingresa el nombre completo del encargado"
              value={encharged}
              onChange={handleEnchargedChange}
            />
            {enchargedError && <span className="text-red-500">{enchargedError}</span>}

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
                    className={`mt-1 mb-1 ${requisitoError ? 'border-red-500' : ''}`}
                    placeholder="Ingresa el requisito"
                    value={requisito.description} // Usa solo la propiedad 'description' del objeto 'requisito'
                    onChange={(e) => handleRequisitoChange(e, requisitoIndex)}
                  />
                  {requisitoError && (
                    <span className="text-red-500">No se permiten números o caracteres especiales y no puede estar vacío.</span>
                  )}

                </div>
                {requisito.pasosRequisito.map((paso, pasoIndex) => (
                  <div className="flex items-center ml-20" key={pasoIndex}>

                    <button
                      className="text-white px-2 py-1 rounded-full mr-2"
                      type="button"
                      onClick={() => {
                        setSelectedStepRequeriment(paso.idStep)
                        eliminarPasoRequisito(requisitoIndex, pasoIndex)
                        setSelectedStepRequerimentsArray((prevArray) => [...prevArray, paso.idStep])

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

                      //console.log(valueNewLocation)
                      
                      //console.log(locationCroquisImg[locationIndex].includes("data:"))
                      //console.log(fileLocationImg)
                    }}
                  />
                  <datalist id={"Locations" + locationIndex.toString()}>
                    {existingLocations.map((existingLocation, i) => (
                      <option
                        key={existingLocation.id}
                        value={existingLocation.name}
                        id={existingLocation.locationIMG
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
                warning
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
      </form >

    </Layout >
  );
}

export default ModificarTramite;
