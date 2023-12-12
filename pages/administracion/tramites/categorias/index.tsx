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
  Card,
  CardBody,
  Label,
  Input,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon } from "icons";
import { ICategoriasData, convertJSONListCategory } from "utils/demo/categoriasData";
import URL from "utils/demo/api";
import Layout from "example/containers/Layout";

import SweetAlert from "react-bootstrap-sweetalert";

import withAuthorization from "components/withAuthorization";

const requiredPermissions = ["Tramites"];

function Categorias() {
  const router = useRouter();
  // * Modificar ruta segun la api * 
  const [state, setState] = useState("activos");
  const route = "Categoria/getActiveCategorias";
  const routeInactives = "Categoria/getDeletedCategorias";
  const deleteCategoryRoute = "Categoria/deleteCategoria/";
  const restoreCategoryRoute = "Categoria/restoreCategoria/";
  const resultsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [pageTable, setPageTable] = useState(1);
  const [categories, setCategories] = useState<ICategoriasData[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<ICategoriasData[]>([])



  useEffect(() => {
    async function doFetch() {
      try {
        const res = await fetch(`${URL.baseUrl}${state == "activos" ? route : routeInactives}`);
        const data = await res.json();
        setCategories(convertJSONListCategory(data.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    doFetch();
  }, [state]);

  const [searchTerm, setSearchTerm] = useState("");

  function onPageChangeTable2(p: number) {
    setPageTable(p);
  }
  useEffect(() => {
    // Filtrar las categorías cada vez que cambie el término de búsqueda o la lista de categorías
    const filteredCategories = categories.filter((categoria) =>
      categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular el inicio y final de los datos de la página actual
    const startIndex = (pageTable - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // Establecer las categorías a mostrar en la tabla según la página actual y el filtro
    setDisplayedCategories(filteredCategories.slice(startIndex, endIndex));
  }, [pageTable, searchTerm, categories]);

  /*
    useEffect(() => {
      setCategories(
        services.slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage
        )
      );
    }, [pageTable]);
  */

  /*
useEffect(() => {
  const startIndex = (pageTable - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  // Solo ejecuta esto si los servicios han cambiado y la página es diferente.
  if (services.length && totalResults !== filteredCategories.length) {
    setCategories(
      filteredCategories.slice(startIndex, endIndex)
    );
  }
  // Asegúrate de incluir todas las dependencias necesarias aquí.
}, [pageTable, filteredCategories]);
*/
  const handleSubmit = async () => {
    await fetch(`${URL.baseUrl}${deleteCategoryRoute}${selectedCategory}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (state != "activos") {
      await fetch(`${URL.baseUrl}${restoreCategoryRoute}${selectedCategory}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    router.reload();
  };

  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };
  const handleActiveChange = (e: any) => {
    setState(e.target.value);
  };
  function truncateText(text: String, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
  const totalResults = categories.length;
  return (
    <Layout>
      <PageTitle>TRAMITES</PageTitle>
      <SectionTitle>Categorias de tramites</SectionTitle>
      <div className="flex w-full gap-2 justify-between mb-8 flex-col sm:flex-row">
        <Card className="shadow-md sm:w-3/4">
          <CardBody>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 p-2 border border-gray-600 bg-gray-700 text-white w-full rounded"
            />
          </CardBody>
        </Card>
        <Card className="shadow-md sm:w-1/4 flex flex-col justify-center items-center">
          <CardBody className="flex justify-center items-start gap-y-2 gap-x-4 flex-row sm:flex-col lg:flex-row">
            <Label radio>
              <Input
                type="radio"
                value="activos"
                name="activeInactive"
                checked={state === 'activos'}
                onChange={(e) => handleActiveChange(e)}
              />
              <span className="ml-2">Activos</span>
            </Label>
            <Label radio>
              <Input
                type="radio"
                value="inactivos"
                name="activeInactive"
                checked={state === 'inactivos'}
                onChange={(e) => handleActiveChange(e)}
              />
              <span className="ml-2">Inactivos</span>
            </Label>
          </CardBody>
        </Card>
      </div>


      <div className="mb-1">
        <Link href={`/administracion/tramites/categorias/crear`}>
          <Button size="small">
            Registrar una nueva categoria de tramites
          </Button>
        </Link>
      </div>

      <TableContainer className="my-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {displayedCategories.map((categoria, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{categoria.id}</p>
                    </div>
                  </div>
                </TableCell>
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
                      <p className="font-semibold">{truncateText(categoria.description, 20)}</p>
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
                    {state === "activos" ? (
                      <>

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
                      </>
                    ) : (

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
                        <Badge className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    )}

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
                        {state == "activos" ? "¿Estás seguro de eliminar la categoria de trámite?" : "¿Estás seguro de restaurar la categoria de trámite?"}
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

export default withAuthorization(Categorias,{requiredPermissions});
