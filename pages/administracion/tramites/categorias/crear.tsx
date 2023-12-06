import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { ICategoriasData, convertJSONListCategory } from "utils/demo/categoriasData";
function CrearCategoria() {
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [textError, setTextError] = useState("");

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoriasData[]>([]);
  const router = useRouter();
  const route = "Categoria/getActiveCategorias";
  const createCategoryRoute = "Categoria/addCategoria"

  const handleSubmit = async () => {
    if (!name || !description) {
      setShowAlert(true);
      return;
    }

    await fetch(`${URL.baseUrl}${createCategoryRoute}`, {
      method: "POST",
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
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}`)
        .then((res) => res.json())
        .then((res) => setCategories(convertJSONListCategory(res.data)));
    }
    doFetch();
  }, []);

  const handleAlertConfirm = () => {
    if (!name || !description) {
      // Los campos están vacíos, muestra un mensaje de error.
      setShowAlert(false); // Cierra la alerta actual
      alert("Por favor, complete todos los campos antes de confirmar.");
      return;
    }

    // Si los campos están llenos, continúa con la creación.
    handleSubmit();
  };


  const handleAlertCancel = () => {
    setShowAlert(false);
  };


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const containsInvalidChars = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputValue);
    const categoryExists = categories.some((category) => category.name === inputValue);
    console.log(categoryExists)
    if (!containsInvalidChars && categoryExists == false) {
      setname(inputValue);
      setNameError(false);
      setTextError("");
    } else {
      setNameError(true);
      setTextError("No se permiten números o caracteres especiales.");
      if (categoryExists) {
        setTextError("El nombre de la categoría ya está en uso. Por favor, elige otro nombre.");
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Utiliza una expresión regular para verificar si contiene números o caracteres especiales.
    const containsInvalidChars = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputValue);
    if (!containsInvalidChars) {
      setDescription(inputValue);
      setHasError(false); // Limpiar el error si no contiene caracteres no válidos.
    } else {
      setHasError(true); // Establecer el estado de error si contiene caracteres no válidos.
    }
  };



  return (
    <Layout>
      <PageTitle>Crear Categoria</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Label>
            <span>Nombre de la categoria</span>
            <Input
              type="text"
              required
              className={`mt-1 ${nameError ? 'border-red-500' : ''}`}
              placeholder="Ingresa el nombre de la categoria"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameChange(e)}
              value={name}
            />
            {nameError && (
              <span className="text-red-500">{textError}.</span>
            )}
          </Label>
          <Label className="mt-4">
            <span>Descripcion de la categoria</span>
            <Input
              type="text"
              required
              className={`mt-1 ${hasError ? 'border-red-500' : ''}`}
              placeholder="Ingresa la descripcion de la categoria"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDescriptionChange(e)}
              value={description}
            />
            {hasError && (
              <span className="text-red-500">No se permiten números o caracteres especiales.</span>
            )}
          </Label>
          <Label className="mt-4">

            <button
              type={"button"}
              onClick={() => setShowAlert(true)}
              className="py-2 px-4 mt-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
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
                ¿Confirma todos los datos de la nueva categoria de tramites?
              </SweetAlert>
            )}

          </Label>
        </form>
      </div>
    </Layout>
  );
}

export default CrearCategoria;
