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

function EditarServicio({ id }: props) {
  const route = "Servicios/getServicioById/";
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [service, setService] = useState<ICajasData>();

  const [name, setname] = useState("");

  const [ubicacion, setubicacion] = useState("");

  const [encharged, setencharged] = useState("");

  const [cellphone, setcellphone] = useState("");

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => setService(convertJSONService(res.data[0])));
    }
    doFetch();
  }, []);

  const updateServiceRoute = "Servicios/updateServicio/";
  const updateUbicacionRoute = "Ubicaciones/updateUbicaciones/";
  const updateReferencesRoute = "Referencia/UpdateReferences/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`${URL.baseUrl}${updateServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        imagenUrl: "",
      }),
    });
    await fetch(`${URL.baseUrl}${updateUbicacionRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion: ubicacion,
        imagen: "",
        video: "",
        serviciosId: id,
        estado: service?.status == "success" ? true : false,
      }),
    });
    await fetch(`${URL.baseUrl}${updateReferencesRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: encharged,
        numerocel: cellphone,
        serviciosId: id,
      }),
    });
    router.back();
  };

  useEffect(() => {
    if (service?.name) {
      setname(service!.name);
      setubicacion(service!.ubicacion);
      setencharged(service!.encharged);
      setcellphone(service!.cellphone);
    }
  }, [service]);

  const handleAlertConfirm = () => {
    const form = document.getElementById("miFormulario") as HTMLFormElement;
    if (form) {
      form.submit();
    }
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
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
            <span>Nombre del servicio</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el nombre del servicio"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Ubicación</span>
            <Input
              className="mt-1"
              placeholder="Ingresa la ubicación del servicio"
              value={ubicacion}
              onChange={(e) => setubicacion(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Encargado</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el encargado del servicio"
              value={encharged}
              onChange={(e) => setencharged(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Teléfono de referencia</span>
            <Input
              className="mt-1"
              placeholder="Ingresa el teléfono de referencia"
              value={cellphone}
              onChange={(e) => setcellphone(e.target.value)}
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
                  Esta seguro que desea actualizar este servicio?
                </SweetAlert>
              )}
            </div>
          </Label>
        </form>
      </div>
    </Layout>
  );
}

export default EditarServicio;
