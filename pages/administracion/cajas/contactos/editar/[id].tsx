import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SweetAlert from "react-bootstrap-sweetalert";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import URL from "utils/demo/api";
import { ICajasData, convertJSONService } from "utils/demo/cajasData";
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

function EditarReferencia({ id }: props) {
  const route = "Referencia/GetReferenceById/";
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [name, setname] = useState("");
  const [telefono, settelefono] = useState("");

  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setvalidationMessage] = useState<string>("");
  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => {
          setname(res.data.nombre);
          settelefono(res.data.numerocel);
        });
    }
    doFetch();
  }, []);

  const updateServiceRoute = "Referencia/UpdateReferences/";

  const handleSubmit = async () => {
    if (name == "" || name == null) {
      setvalidationMessage("Debe rellenar el campo de Nombre");
      setShowAlertValidation(true);
      return;
    }
    if (telefono == "" || telefono == null) {
      setvalidationMessage("Debe rellenar el campo de Teléfono");
      setShowAlertValidation(true);
      return;
    }
    await fetch(`${URL.baseUrl}${updateServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        numerocel: telefono,
      }),
    });
    router.push("../../horariosubicacion");
  };

  return (
    <Layout>
      <PageTitle>Editar un servicio</PageTitle>
      <div className="mb-4">
        <Link href={`/administracion/cajas`}>
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
            <span>Nombre del contacto</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del contacto"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Teléfono del contacto</span>
            <Input
              type="number"
              className="mt-1"
              placeholder="Ingresa el teléfono"
              value={telefono}
              onChange={(e) => settelefono(e.target.value)}
            />
          </Label>

          <Label className="mt-4">
            <div className="relative text-gray-500 focus-within:text-purple-600">
              <input
                disabled
                className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
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
          onConfirm={() => {
            handleSubmit();
          }}
          onCancel={() => {
            setShowAlert(false);
          }}
        >
          Confirma todos los datos del contacto?
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

export default EditarReferencia;
