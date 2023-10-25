import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon } from "icons";
import { ICategoriasData, convertJSONListCategory } from "utils/demo/categoriasData";
import URL from "utils/demo/api";
import Layout from "example/containers/Layout";

import SweetAlert from "react-bootstrap-sweetalert";
function Categorias() {
  const router = useRouter();
  // * Modificar ruta segun la api * 
  const route = "Categoria/getAllCategorias";
  const deleteCategoryRoute = "Categoria/deleteCategoria/";
  const resultsPerPage = 10;

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}`)
        .then((res) => res.json())
        .then((res) => setCategories(convertJSONListCategory(res.data)));
    }
    doFetch();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [pageTable, setPageTable] = useState(1);
  const [services, setCategories] = useState<ICategoriasData[]>([]);
  const totalResults = services.length;

  function onPageChangeTable2(p: number) {
    setPageTable(p);
  }

  useEffect(() => {
    setCategories(
      services.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
  }, [pageTable]);

  const handleSubmit = async () => {
    await fetch(`${URL.baseUrl}${deleteCategoryRoute}${selectedCategory}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.reload();
  };

  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };
  return (
    <Layout>
      <PageTitle>TRAMITES</PageTitle>

      <SectionTitle>Categorias de tramites</SectionTitle>
      <TableContainer className="my-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {services.map((categoria, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{categoria.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{categoria.description}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    type={categoria.status == "success" ? "success" : "danger"}
                  >
                    {categoria.status == "success" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/administracion/tramites/categorias/editar/[id]`}
                      as={`/administracion/tramites/categorias/editar/${categoria.id}`}
                    >
                      <Button layout="link" size="small" aria-label="Edit">
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </Link>

                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      type={"button"}
                      onClick={() => {
                        setShowAlert(true);
                        setSelectedCategory(categoria.id);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>

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
                        Confirma todos los datos del nuevo servicio?
                      </SweetAlert>
                    )}

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Tabla de navegación"
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  );
}

export default Categorias;
