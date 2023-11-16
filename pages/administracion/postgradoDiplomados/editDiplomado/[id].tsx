import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SweetAlert from "react-bootstrap-sweetalert";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";

import {
  IAddDiplomado,
  IDiplomadoData,
  convertJSONDiplomado,
  convertJSONListDiplomado,
} from "utils/interfaces/PostGrado/MDD";
import { GetServerSidePropsContext } from "next";
import URL from "pages/api/apiCarrer";

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

function EditDiplomado({ id }: props) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [diplomado, setDiplomado] = useState<IDiplomadoData>();

  const [titulo, setTitulo] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [imagen, setImagen] = useState("");

  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}/api/Facultad/ListaActivos`)
        .then((res) => res.json())
        .then((res) => setDiplomado(convertJSONDiplomado(res.response)));
    }
    doFetch();
  }, []);

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}/api/Carrera/Obtener/${id}`)
        .then((res) => res.json())
        .then((res) => {
          const diplomadoData = convertJSONDiplomado(res.response);
          console.log("Datos de la API:", diplomadoData); // Agregar este console.log
          setDiplomado(diplomadoData);
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
    if (modalidad === "" || modalidad === null) {
      setValidationMessage("Debe rellenar el campo de modalidad");
      setShowAlertValidation(true);
      return;
    }
    if (imagen === "" || imagen === null) {
      setValidationMessage("Debe rellenar el campo de Imagen");
      setShowAlertValidation(true);
      return;
    }

    await fetch(`${URL.baseUrl}/api/Carrera/Editar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        titulo: titulo,
        modalidad: modalidad,
        imagen: imagen,
      }),
    });
    router.back();
  };

  useEffect(() => {
    if (diplomado?.titulo) {
      setTitulo(diplomado!.titulo);
      setModalidad(diplomado!.modalidad);
      setImagen(diplomado!.imagen);
    }
  }, [diplomado]);

  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <PageTitle>Editar Diplomado</PageTitle>
      <div className="mb-4">
        <Link href={`/administracion/postgradoDiplomados`}>
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
              placeholder="Ingresa el titulo del diplomado."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Label>
          <Label className="mt-3">
            <span>Modalidad</span>
            <Textarea
              value={modalidad}
              className="mt-1"
              rows={5}
              placeholder="Ingrese la modalidad del diplomado."
              onChange={(e) => setModalidad(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>URL de la Imagen</span>
            <Input
              className="mt-1"
              placeholder="Ingresa la URL de la imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
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
          Esta seguro que desea actualizar este diplomado?
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

export default EditDiplomado;
