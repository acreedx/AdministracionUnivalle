import React, { useState } from "react";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import { useRouter } from "next/router";

import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { GetServerSidePropsContext } from "next";

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
function CrearRequisito({ id }: props) {
  const router = useRouter();
  const [name, setname] = useState("");
  const createServiceRoute = "Requisitos/addRequisito";
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setvalidationMessage] = useState<string>("");
  const handleSubmit = async () => {
    if (name == "" || name == null) {
      setvalidationMessage("Debe rellenar el campo de Requisito");
      setShowAlertValidation(true);
      return;
    }
    await fetch(`${URL.baseUrl}${createServiceRoute}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: name,
        serviciosId: id,
        pasos: [],
      }),
    });
    router.back();
  };

  return (
    <Layout>
      <PageTitle>Añadir un nuevo requisito</PageTitle>
      <div className="mb-4">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Link href="#">
            <Button size="small" onClick={() => router.back()}>
              <span className="mr-2" aria-hidden="true">
                {"←"}
              </span>
              Volver
            </Button>
          </Link>
        </form>
      </div>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Descripción del requisito</span>
          <Input
            className="mt-1"
            placeholder="Ingresa el nombre del servicio"
            onChange={(e) => setname(e.target.value)}
          />
        </Label>
        <Label className="mt-4">
          <div className="relative text-gray-500 focus-within:text-purple-600">
            <input className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" />
            <button
              type={"button"}
              onClick={() => setShowAlert(true)}
              className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Crear
            </button>
          </div>
        </Label>
      </div>
      {showAlert && (
        <SweetAlert
          warning // Puedes personalizar el tipo de alerta (success, error, warning, etc.)
          title="Atención"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          showCancel
          onConfirm={() => {
            handleSubmit();
          }}
          onCancel={() => {
            setShowAlert(false);
          }}
        >
          Confirma todos los datos del nuevo requisito?
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

export default CrearRequisito;
