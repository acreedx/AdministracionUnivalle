import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SweetAlert from "react-bootstrap-sweetalert";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import URLS from "utils/demo/api";
import { ICajasData, convertJSONService } from "utils/demo/cajasData";
import { GetServerSidePropsContext } from "next";
import SectionTitle from "example/components/Typography/SectionTitle";

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

  const [imgUrl, setimgUrl] = useState("");
  const [ubicacion, setubicacion] = useState("");

  const [encharged, setencharged] = useState("");

  const [cellphone, setcellphone] = useState("");

  const [showAlertValidation, setShowAlertValidation] =
    useState<boolean>(false);
  const [validationMessage, setvalidationMessage] = useState<string>("");
  useEffect(() => {
    async function doFetch() {
      fetch(`${URLS.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) => setService(convertJSONService(res.data[0])));
    }
    doFetch();
  }, []);

  const updateServiceRoute = "Servicios/updateServicio/";
  const updateUbicacionRoute = "Ubicaciones/updateUbicaciones/";
  const updateReferencesRoute = "Referencia/UpdateReferences/";

  const handleSubmit = async () => {
    if (name == "" || name == null) {
      setvalidationMessage("Debe rellenar el campo de Nombre");
      setShowAlertValidation(true);
      return;
    }
    if (imgUrl == "" || imgUrl == null) {
      setvalidationMessage("Debe rellenar el campo de Imagen");
      setShowAlertValidation(true);
      return;
    }
    if (ubicacion == "" || ubicacion == null) {
      setvalidationMessage("Debe rellenar el campo de Ubicación");
      setShowAlertValidation(true);
      return;
    }
    if (encharged == "" || encharged == null) {
      setvalidationMessage("Debe rellenar el campo de Encargado");
      setShowAlertValidation(true);
      return;
    }
    if (cellphone == "" || cellphone == null) {
      setvalidationMessage("Debe rellenar el campo de Teléfono");
      setShowAlertValidation(true);
      return;
    }
    await fetch(`${URLS.baseUrl}${updateServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        imagenUrl: imgUrl,
      }),
    });
    await fetch(
      `${URLS.baseUrl}${updateUbicacionRoute}${service?.ubicacionId}`,
      {
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
      }
    );
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
    router.back();
  };

  useEffect(() => {
    if (service?.name) {
      setname(service!.name);
      setimgUrl(service!.imagenUrl);
      setubicacion(service!.ubicacion == null ? "" : service!.ubicacion);
      setencharged(service!.encharged);
      setcellphone(service!.cellphone);
    }
  }, [service]);

  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };
  
  const [serviceImg, setImg]: any = useState(null);
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
        <SectionTitle>Datos generales</SectionTitle>
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
            <span className=" text-lg">Imagen de referencia del tramite</span>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <span>Imagen Actual</span>
                  <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={service?.imagenUrl === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : service?.imagenUrl}
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
            
          </Label>
          <Input
              type="file"
              accept=".jpg, .jpeg, .png"
              className="mt-4"
              placeholder="Imagen del servicio"
              onChange={e => setImg(e.target.files?.[0] || null)}
            />
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
              type="number"
              placeholder="Ingresa el teléfono de referencia"
              value={cellphone}
              onChange={(e) => setcellphone(e.target.value)}
            />
          </Label>
      </div>
      
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Requisitos</SectionTitle>
      </div>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <SectionTitle>Ubicaciones</SectionTitle>
      </div>

      <Label className="mb-4">
        <div className="relative text-gray-500 focus-within:text-purple-600">
          <input
            className="block w-full py-2 pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
            disabled
          />
          <button
            type={"button"}
            onClick={() => setShowAlert(true)}
            className="absolute inset-y-0 right-0 px-4 py-2 text-lg font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Editar
          </button>
        </div>
      </Label>
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

export default EditarServicio;
