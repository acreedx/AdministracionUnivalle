import React from "react";
import { Input, Label } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { Button } from "@roketid/windmill-react-ui";
import { useRouter } from "next/router";

function CrearRequisito() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <PageTitle>Añadir un nuevo requisito</PageTitle>
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
        <Label>
          <span>Descripción del requisito</span>
          <Input
            className="mt-1"
            placeholder="Ingresa el nombre del servicio"
          />
        </Label>
        <Label className="mt-4">
          <div className="relative text-gray-500 focus-within:text-purple-600">
            <input className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input" />
            <button className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              Click
            </button>
          </div>
        </Label>
      </div>
    </Layout>
  );
}

export default CrearRequisito;
