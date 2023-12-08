"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
import SweetAlert from "react-bootstrap-sweetalert";
import { errorAlert, successAlert, warningAlert } from "components/alerts";
import router, { useRouter } from "next/router";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  Badge,
  Avatar,
  Button,
  Pagination,
  TableContainer,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, XIcon, CheckIcon } from "icons";
import URL from "../../api/apiLibraryDirection";
import Layout from "example/containers/Layout";
import { route } from "next/dist/server/router";
import response, { IBibliotecaData } from "utils/demo/bibliotecaData";

const response2 = response.concat([]);

function Biblioteca() {
  const [pageTable2, setPageTable2] = useState(1);
  const [dataTable2, setLibros] = useState<IBibliotecaData[]>([]);
  const [TotalResult, setTotal] = useState(0);
  const resultsPerPage = 10;
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [selectedLibro, setSelectedLibro] = useState<IBibliotecaData | null>(
    null
  );
  const [selectedLibroForEdit, setSelectedLibroForEdit] =
    useState<IBibliotecaData | null>(null);

  const fetchData = async () => {
    const query = await fetch(`${URL.baseUrl}Libro/Lista`);
    const response = await query.json();
    setTotal(response.response.length);
    return response.response;
  };
  const handleEliminarClick = (libro: IBibliotecaData) => {
    setSelectedLibro(libro);
    setShowAlert(true);
  };
  const handleAlertConfirm = async () => {
    if (selectedLibro) {
      try {
        await handleCambiarEstado(selectedLibro.idLibro);
        setShowAlert(false);
        // router.reload();
      } catch (error) {
        console.error("Error al cambiar el estado:", error);
      }
    }
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  const handleEditarClick = (libro: IBibliotecaData) => {
    setSelectedLibroForEdit(libro);
    // Redirige a la página de edición con el ID del libro
    router.push(`/servicios/biblioteca/editar/${libro.idLibro}`);
  };

  const handleCambiarEstado = async (idLibro: number) => {
    try {
      console.log("ID del libro:", idLibro);

      const response = await fetch(`${URL.baseUrl}Libro/CambiarEstado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idLibro }),
      });

      if (response.ok) {
        // La solicitud fue exitosa, puedes manejar la respuesta si es necesario
        successAlert("Éxito al cambiar el estado del registro");
        // setTimeout(() => router.reload(), 2000);
        const updatedData = await fetchData();
        setLibros(updatedData);
      } else {
        // La solicitud no fue exitosa, puedes manejar el error si es necesario
        throw new Error();
      }
    } catch (error) {
      // Manejo de errores en caso de problemas con la solicitud
      console.error("Error en la solicitud:", error);
    }
  };

  function onPageChangeTable2(p: number) {
    setPageTable2(p);
  }

  useEffect(() => {
    const getData = async () => {
      const query = await fetch(`${URL.baseUrl}Libro/Lista`);
      const response = await query.json();
      setTotal(response.response.length);
      setLibros(
        response.response.slice(
          (pageTable2 - 1) * resultsPerPage,
          pageTable2 * resultsPerPage
        )
      );
    };
    getData();
  }, [pageTable2]);

  return (
    <Layout>
      <PageTitle>Libros Destacados</PageTitle>
      <div>
        <Button>
          <Link href={"/servicios/biblioteca/create"}>Agregar Libro</Link>
        </Button>
      </div>
      <TableContainer className="mb-8 mt-6">
        <Table className="mb-1 mt-4">
          <TableHeader>
            <tr>
              <TableCell className="font-black">Libro</TableCell>
              <TableCell className="font-black">Autor</TableCell>
              <TableCell className="font-black">Editorial</TableCell>
              <TableCell className="font-black">N° Páginas</TableCell>
              <TableCell className="font-black">Idioma</TableCell>
              <TableCell className="font-black">Año</TableCell>
              <TableCell className="font-black">Descripción</TableCell>
              <TableCell className="font-black">Estado</TableCell>
              <TableCell className="font-black">Imagen</TableCell>
              <TableCell className="font-black">Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable2.map((libro, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs">
                        {libro.nombreLibro}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs">
                        {libro.nombreAutor}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs">{libro.editorial}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs px-5">
                        {libro.npaginas}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs">{libro.idioma}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs">{libro.anio}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-xs">
                        {libro.descripcion}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type={libro.estado ? "success" : "neutral"}>
                    {libro.estado ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {libro.ruta ? (
                    <Avatar className="hidden mr-3 md:block" src={libro.ruta} />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    {/* Agrega aquí tus enlaces y botones de acciones */}
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Editar"
                      onClick={() => handleEditarClick(libro)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Eliminar"
                      onClick={() => handleEliminarClick(libro)}
                    >
                      {libro.estado ? (
                        <XIcon className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={TotalResult}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Tabla de navegación"
          />
        </TableFooter>
      </TableContainer>
      {selectedLibro && (
        <SweetAlert
          warning
          title="Atención"
          show={showAlert}
          customButtons={
            <React.Fragment>
              <Button
                onClick={handleAlertConfirm}
                className="mx-2 bg-green-600"
              >
                Confirmar
              </Button>
              <Button onClick={handleAlertCancel} className="mx-2 bg-red-600">
                Cancelar
              </Button>
            </React.Fragment>
          }
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertCancel}
          focusCancelBtn
        >
          {selectedLibro.estado
            ? "¿Está seguro de cambiar el estado del libro a inactivo?"
            : "¿Está seguro de cambiar el estado del libro a activo?"}
        </SweetAlert>
      )}
    </Layout>
  );
}

export default Biblioteca;
