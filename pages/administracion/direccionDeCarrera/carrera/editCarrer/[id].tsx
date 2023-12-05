import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SweetAlert from "react-bootstrap-sweetalert";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import URL_API from "../../../../api/apiCareerDirection";
import {
  ICarrersData,
  IFacultiesData,
  convertJSONCarrer,
  convertJSONListFaculty,
} from "utils/interfaces/DireccionDeCarrera/Carreras";
import { GetServerSidePropsContext } from "next";
import { uploadFile } from "../../../../../firebase/config";

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

function EditCarrer({ id }: props) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [carrer, setCarrer] = useState<ICarrersData>();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tituloOtorgado, setTituloOtorgado] = useState("");
  const [duracion, setDuracion] = useState(0);
  const [planDeEstudios, setPlanDeEstudios] = useState("");
  let [imagen, setImagen] = useState("");
  const [facultadId, setFacultadId] = useState(0);
  const [img, setImg]: any = useState(null);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [faculties, setFaculties] = useState<IFacultiesData[]>([]);
  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL_API.baseUrl}Facultad/ListaActivos`)
        .then((res) => res.json())
        .then((res) => setFaculties(convertJSONListFaculty(res.response)));
    }
    doFetch();
  }, []);

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL_API.baseUrl}Carrera/Obtener/${id}`)
        .then((res) => res.json())
        .then((res) => {
          const carrerData = convertJSONCarrer(res.response);
          console.log("Datos de la API:", carrerData); // Agregar este console.log
          setCarrer(carrerData);
        })
        .catch((error) => {
          console.error("Error al obtener datos de la API:", error);
        });
    }

    doFetch();
  }, []);

  const handleSubmit = async () => {
    if (titulo === "" || titulo === null) {
      setValidationMessage("Debe rellenar el campo de Título");
      setShowAlertValidation(true);
      return;
    }
    if (descripcion === "" || descripcion === null) {
      setValidationMessage("Debe rellenar el campo de Descripción");
      setShowAlertValidation(true);
      return;
    }
    if (tituloOtorgado === "" || tituloOtorgado === null) {
      setValidationMessage("Debe rellenar el campo de Título Otorgado");
      setShowAlertValidation(true);
      return;
    }
    if (duracion === 0 || duracion === null) {
      setValidationMessage("Debe rellenar el campo de Duración");
      setShowAlertValidation(true);
      return;
    }
    if (planDeEstudios === "" || planDeEstudios === null) {
      setValidationMessage("Debe rellenar el campo de Plan de Estudios");
      setShowAlertValidation(true);
      return;
    }
    
    if (img != null) {
      imagen = await uploadFile(img, "carreras/");
    }
    if (facultadId === 0 || facultadId === null) {
      setValidationMessage("Debe rellenar el campo de Facultad ID");
      setShowAlertValidation(true);
      return;
    }

    await fetch(`${URL_API.baseUrl}Carrera/Editar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        titulo: titulo,
        descripcion: descripcion,
        tituloOtorgado: tituloOtorgado,
        duracion: duracion,
        planDeEstudios: planDeEstudios,
        imagen: imagen,
        facultadId: selectedFaculty,
      }),
    });
    router.back();
  };

  useEffect(() => {
    if (carrer?.titulo) {
      setTitulo(carrer!.titulo);
      setDescripcion(carrer!.descripcion);
      setTituloOtorgado(carrer!.tituloOtorgado);
      setDuracion(carrer!.duracion);
      setPlanDeEstudios(carrer!.planDeEstudios);
      setImagen(carrer!.imagen);
      setFacultadId(carrer!.facultadId);
    }
  }, [carrer]);

  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <PageTitle>Editar Carrera</PageTitle>
      <div className="mb-4">
        <Link href={`/administracion/direccionDeCarrera/carrera`}>
          <Button size="small">
            <span className="mr-2" aria-hidden="true">
              {"←"}
            </span>
            Volver
          </Button>
        </Link>
      </div>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Label>
            <span>Titulo</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el titulo de la carrera."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Label>
          <Label className="mt-3">
            <span>Descripción</span>
            <Textarea
              value={descripcion}
              className="mt-1"
              rows={5}
              placeholder="Ingrese la descripción de la carrera."
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Label>
          <Label className="mt-3">
            <span>Título Otorgado</span>
            <Input
              value={tituloOtorgado}
              className="mt-1"
              maxLength={50}
              placeholder="Ingrese el título que otorga la carrera"
              onChange={(e) => setTituloOtorgado(e.target.value)}
            />
          </Label>
          <Label className="mt-3">
            <span>Duración</span>
            <Input
              value={duracion}
              type="number"
              maxLength={1}
              className="mt-1"
              placeholder="Escriba la duración de la carrera"
              onChange={(e) => setDuracion(e.target.valueAsNumber)}
            />
          </Label>
          <Label className="mt-3">
            <span>Plan de Estudios</span>
            <Input
              value={planDeEstudios}
              className="mt-1"
              placeholder="Ingrese la URL del pdf con el plan de estudios."
              onChange={(e) => setPlanDeEstudios(e.target.value)}
            />
          </Label>
          
          <Label>
            <span className=" text-lg">
              Imagen de referencia para la Facultad
            </span>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <span>Imagen Actual</span>
                  <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        imagen === ""
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                          : imagen
                      }
                      alt="Imagen Actual"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <span>Nueva Imagen</span>
                  <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        img === null
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                          : URL.createObjectURL(img)
                      }
                      alt="Imagen Nueva"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Input
              type="file"
              className="mt-1"
              placeholder="Imagen de la facultad"
              onChange={(e) => setImg(e.target.files?.[0] || null)}
            />
          </Label>
          <Label className="mt-4">
            <span>Seleccione una Facultad</span>
            <Select
              className="mt-1"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="" disabled>
                Seleccione una facultad
              </option>
              {faculties.map((facultad) => (
                <option key={facultad.id} value={facultad.id}>
                  {facultad.titulo}
                </option>
              ))}
            </Select>
          </Label>

          <Label className="mt-4">
            <div className="relative text-gray-500 focus-within:text-purple-600">
              <input
                className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                disabled
              />
              <button
                type={"button"}
                onClick={() => setShowAlert(true)}
                className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
                Editar
              </button>
            </div>
          </Label>
        </form>
      </div>
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
          Esta seguro que desea actualizar esta carrera?
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

export default EditCarrer;
