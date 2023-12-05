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
  IEditFaculty,
  IFacultiesData,
  convertJSONFaculty,
} from "utils/interfaces/DireccionDeCarrera/Facultades";
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

function EditFaculty({ id }: props) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [faculty, setFaculty] = useState<IFacultiesData>();


  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  let [imagen, setImagen] = useState("");
  const [img, setImg]: any = useState(null);

  
  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");

  

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL_API.baseUrl}Facultad/Obtener/${id}`)
        .then((res) => res.json())
        .then((res) => {
          const facultyData = convertJSONFaculty(res.response);
          console.log("Datos de la API:", facultyData); // Agregar este console.log
          setFaculty(facultyData);
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
    

    if (img != null) {
      imagen = await uploadFile(img, "facultades/");
    }
      
    

    await fetch(`${URL_API.baseUrl}Facultad/Editar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        titulo: titulo.toUpperCase(),
        descripcion: descripcion,
        imagen: imagen,
      }),
    });
    router.back();
  };

  useEffect(() => {
    if (faculty?.titulo) {
      setTitulo(faculty!.titulo);
      setDescripcion(faculty!.descripcion);
      setImagen(faculty!.imagen);;
    }
  }, [faculty]);

  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <PageTitle>Editar Facultad</PageTitle>
      <div className="mb-4">
        <Link href={`/administracion/direccionDeCarrera/facultad`}>
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
              placeholder="Ingresa el titulo de la facultad."
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
              placeholder="Ingrese la descripción de la facultad."
              onChange={(e) => setDescripcion(e.target.value)}
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
          Esta seguro que desea actualizar esta facultad?
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

export default EditFaculty;
