import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SweetAlert from "react-bootstrap-sweetalert";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import URL from "utils/demo/api";
import { ICategoriasData, convertJSONCategory, convertJSONListCategory } from "utils/demo/categoriasData";
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

function EditarCategoria({ id }: props) {
  const route = "Categoria/getCategoriaById/";
  const routeActiveCategories = "Categoria/getActiveCategorias";

  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [service, setService] = useState<ICategoriasData>();
  const [nameError, setNameError] = useState<boolean>(false);
  const [textError, setTextError] = useState("");
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [categories, setCategories] = useState<ICategoriasData[]>([]);


  useEffect(() => {

    async function doFetch() {
      try {
        const response = await fetch(`${URL.baseUrl}${route}${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setService(convertJSONCategory(data.data));
          } else {
            console.error("La respuesta de la API no contiene datos válidos.");
          }
        } else {
          console.error("Error en la solicitud a la API:", response.status);
        }
      } catch (error) {
        console.error("Error en la solicitud a la API:", error);
      }
    }

    async function ListCategories() {
      fetch(`${URL.baseUrl}${routeActiveCategories}`)
        .then((res) => res.json())
        .then((res) => setCategories(convertJSONListCategory(res.data)));
    }
    doFetch();
    ListCategories();
  }, []);



  const updateServiceRoute = "Categoria/updateCategoria/";

  const handleSubmit = async () => {
    await fetch(`${URL.baseUrl}${updateServiceRoute}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombreCategoria: name,
        descripcion: description,
      }),
    });

    router.push("/administracion/tramites/categorias/");
  };

  useEffect(() => {
    if (service?.name || service?.description) {
      setname(service!.name);
      setdescription(service!.description);
      console.log("name:", service.name);
      console.log("description:", service.description);
    }
  }, [service]);


  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const containsInvalidChars = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputValue);
    const isSameAsExisting = service?.name === inputValue;
    const categoryExists = categories.some((category) => category.name === inputValue);
    console.log(categoryExists)
    if (!containsInvalidChars && !categoryExists || isSameAsExisting) {
      setname(inputValue);
      setNameError(false);
      setTextError("");
    } else {
      setNameError(true);
      setTextError("No se permiten números o caracteres especiales.");
      if (categoryExists && !isSameAsExisting) {
        setTextError("El nombre de la categoría ya está en uso. Por favor, elige otro nombre.");
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const containsInvalidChars = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputValue);
    if (!containsInvalidChars) {
      setdescription(inputValue);
      setDescriptionError(false); // Limpiar el error si no contiene caracteres no válidos.
    } else {
      setDescriptionError(true); // Establecer el estado de error si contiene caracteres no válidos.
    }
  };



  return (
    <Layout>
      <PageTitle>Editar Categoria </PageTitle>
      <div className="mb-4">
        <Link href={`/administracion/tramites/categorias`}>
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
            <span>Nombre de la categoria</span>
            <Input
              className={`mt-1 ${nameError ? 'border-red-500' : ''}`}
              placeholder="Ingresa el nombre de la categoria"
              value={name}
              onChange={(e) => handleNameChange(e)}
            />
            {nameError && (
              <span className="text-red-500">{textError}</span>
            )}
          </Label>

          <Label className="mt-4">
            <span>Descripcion</span>
            <Input
              className={`mt-1 ${descriptionError ? 'border-red-500' : ''}`}
              placeholder="Ingresa la descripcion de la categoria"
              value={description}
              onChange={(e) => handleDescriptionChange(e)}
            />
            {descriptionError && (
              <span className="text-red-500">No se permiten números o caracteres especiales.</span>
            )}
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

export default EditarCategoria;
