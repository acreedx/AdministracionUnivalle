import React, { useState, useEffect } from "react";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import { useRouter } from "next/router";
import Layout from "example/containers/Layout";
import Link from "next/link";
import URL from "utils/demo/api";
import { Button } from "@roketid/windmill-react-ui";
import { GetServerSidePropsContext } from "next";

import SweetAlert from "react-bootstrap-sweetalert";
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
  const route = "Requisitos/getRequisitosById/";
  const router = useRouter();
  const [requirement, setrequirement] = useState("");
  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => setrequirement(res.data[0].descripcion));
    }
    doFetch();
  }, []);
  const updateRequirement = "Requisitos/updateRequisito/";
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const handleSubmit = async () => {
    await fetch(`${URL.baseUrl}${updateRequirement}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: requirement,
        serviciosId: id,
        pasos: [],
      }),
    });
    router.back();
  };
  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };
  return (
    <Layout>
      <PageTitle>Editar un requisito</PageTitle>

      <div className="mb-4">
        <Link href="#">
          <Button size="small" onClick={() => router.back()}>
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
            <span>Descripción del requisito</span>
            <Input
              className="mt-1"
              placeholder="Ingrese la descripcion de este requisito"
              value={requirement}
              onChange={(e) => setrequirement(e.target.value)}
            />
          </Label>
        </form>
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
                Confirma todos los datos del nuevo requisito?
              </SweetAlert>
            )}
          </div>
        </Label>
      </div>
    </Layout>
  );
}

export default CrearRequisito;
