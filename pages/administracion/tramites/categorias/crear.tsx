import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import URL from "utils/demo/api";
import SweetAlert from "react-bootstrap-sweetalert";

function CrearCategoria() {
  const [name, setname] = useState("");

  const [description, setDescription] = useState("");


  const [showAlert, setShowAlert] = useState<boolean>(false);
  const router = useRouter();

  const createCategoryRoute = "Categoria/addCategoria"

  const handleSubmit = async () => {
    if (name == null || description == null) {
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
      <PageTitle>Crear Categoria</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form id="miFormulario" onSubmit={handleSubmit}>
          <Label>
            <span>Nombre de la categoria</span>
            <Input
              type="text"
              required
              className="mt-1"
              placeholder="Ingresa el nombre de la categoria"
              onChange={(e) => setname(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Descripcion de la categoria</span>
            <Input
              type="text"
              required
              className="mt-1"
              placeholder="Ingresa la descripcion de la categoria"
              onChange={(e) => setDescription(e.target.value)}
            />
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
