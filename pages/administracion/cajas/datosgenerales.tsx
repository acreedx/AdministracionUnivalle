import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IEditarModulo,
  IEditarUbicacion,
  IEditarReferenciaArray,
  IEditarRequisitosArray,
} from "../../../utils/interfaces/servicios";
import { Input, Label } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import { useRouter } from "next/router";
import { successAlert, errorAlert } from "../../../components/alerts";
import { ToastContainer } from "react-toastify";
import { uploadFile } from "../../../firebase/config";
import ReferenciaInputs from "../../../components/referenciasInput";
import VideoPlayer from "components/video_player";
export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

import withAuthorization from "components/withAuthorization";

const requiredPermissions = ["Cajas"];

function EditarDatosGeneralesPage() {
  const [ubicacionVideo, setUVideo]: any = useState(null);
  const [referenciaData, setReferenciaData] = useState<string[]>([]);
  const [ubicacionData, setubicacionData] = useState<IEditarUbicacion>();
  const editarUbicacion = () => {};
  const handleAddReferencias = () => {};
  const editarReferencias = () => {};
  const handleRequirementChange = (index: Number, val: string) => {};
  return (
    <Layout>
      <PageTitle>Editar Pagina Principal - Cajas</PageTitle>
      <SectionTitle>Contactos de referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {referenciaData.map((referencia, index) => (
          <div key={index}>
            <Input
              type="text"
              className="mt-1 mb-4"
              value={referencia}
              placeholder="Ingresa el nombre del requisito"
              onChange={(e) => handleRequirementChange(index, e.target.value)}
            />
          </div>
        ))}
        <div className="flex flex-row-reverse ...">
          <div>
            <Button
              size="small"
              onClick={() => {
                setReferenciaData([...referenciaData, ""]);
              }}
            >
              +
            </Button>
          </div>
        </div>
        <div className=" mt-4">
          <Button size="large" onClick={() => editarReferencias()}>
            Editar
          </Button>
        </div>
      </div>
      <SectionTitle>Ubicación</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          <span className=" text-lg">Video de la ubicación del servicio</span>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <span>Video Actual</span>
                <div className="w-96 h-56 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                  <VideoPlayer
                    url={
                      ubicacionData?.video === null ? "" : ubicacionData?.video!
                    }
                    width="384"
                    height="224"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <span>Nuevo Video</span>
                <div className="w-96 h-56 border-2 border-gray-500 rounded-lg overflow-hidden">
                  <VideoPlayer
                    url={
                      ubicacionData?.video === null ? "" : ubicacionData?.video!
                    }
                    width="384"
                    height="224"
                  />
                </div>
              </div>
            </div>
          </div>
          <Label className="mb-4">
            <div className="relative text-gray-500 focus-within:text-purple-600">
              <input
                className="block w-full py-2 pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                disabled
              />
              <Input
                type="file"
                className="mt-1"
                placeholder="Video para ubicación"
                onChange={(e) => setUVideo(e.target.files?.[0] || null)}
              />
            </div>
          </Label>
        </Label>

        <div className="mt-4">
          <Button size="large" onClick={() => editarUbicacion()}>
            Editar
          </Button>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default EditarDatosGeneralesPage;
