import React, { useState, useEffect, ChangeEvent } from "react";
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
  Avatar,
  Button,
  Pagination,
  Label,
  Input,
  CardBody,
  Card,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";
import { FaRedo } from "react-icons/fa";

import Layout from "example/containers/Layout";
import Link from "next/link";
import { errorAlert, successAlert, warningAlert } from "components/alerts";
import { ToastContainer } from "react-toastify";
import { isValidUrl } from "utils/functions/url";
import SweetAlert from "react-bootstrap-sweetalert";
import { useRouter } from "next/router";
import SearchBar from "components/searchBar";

import URL from "../../../api/apiCarrer";

import {IMaestrias} from "utils/interfaces/PostGrado/MDD";

function Maestria() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable, setTotalData] = useState<IMaestrias[]>([]);
  const [dataTable2, setUserInfo] = useState<IMaestrias[]>([]);
  const [dataTableSearch, setSearch] = useState<IMaestrias[]>([]);

  const [TotalResult, setTotal] = useState(Number);
  const [searchPage, setSearchPage] = useState(1);

  const resultsPerPage = 10;

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [selectedObj, setSelectedObj] = useState<number>(0);
  const [activeInactive, setActiveInactive] = useState<string>();

  function onPageChangeTable2(p: number) {
    setPageTable2(p);
  }

  const getData = async (url: string) => {
    try {
      const query = await fetch(url);
      if (query.ok) {
        const res: any = await query.json();
        if (res.response != null) {
          setTotalData(res.response);
          setTotal(res.response.length);
          setUserInfo(
            res.response.slice(
              (pageTable2 - 1) * resultsPerPage,
              pageTable2 * resultsPerPage
            )
          );
          setSearch(res.response);
        } else {
          console.log(url);
          warningAlert("No se encontrarón datos");
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      errorAlert(
        "Ocurrió un error al traer los datos o no existe el tipo de registro pedido"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getData(`${URL.baseUrl}/api/Carrera/ListaActivos`);
    setActiveInactive("activos");
    setTimeout(() => setIsLoading(false), 1000);
  }, [pageTable2]);

  const handleSubmit = async (action: boolean) => {
    try {
      const response = await fetch(
        `${URL.baseUrl}/api/Carrera/${
          action ? "Eliminar" : "Reestablecer"
        }/${selectedObj}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        successAlert("Éxito al cambiar el estado del registro");
        setTimeout(() => router.reload(), 2000);
      } else {
        throw new Error();
      }
    } catch (error) {
      handleAlertCancel();
      errorAlert("Error al cambiar el estado del registro");
    }
  };

  const handleAlertConfirm = (action: boolean) => {
    handleSubmit(action);
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  const searchObjs = (parameter: string) => {
    const filteredData = dataTable.filter((obj) =>
      obj.titulo.toLowerCase().includes(parameter.toLowerCase())
    );
    setSearch(filteredData);
    setTotal(filteredData.length);
    setPageTable2(1);
    setSearchPage(1);
  };

  const cleanMissObjects = () => {
    setSearch(dataTable);
    setTotal(dataTable.length);
    setPageTable2(1);
    setSearchPage(1);
  };

  const handleActiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveInactive(e.target.value);
    if (e.target.value === "activos") {
      getData(`${URL.baseUrl}/api/Carrera/ListaActivos`);
    } else if (e.target.value === "inactivos") {
      getData(`${URL.baseUrl}/api/Carrera/ListaInactivos`);
    }
  };

  return (
    <Layout>
      {!isLoading ? (
        <>
          <PageTitle>Maestrias, Doctorados y Diplomados - PostGrado</PageTitle>

          <div className="mb-8">
            <Link href="/administracion/postgradoMaestrias/addMaestria/">
              <Button size="large">Agregar Maestria</Button>
            </Link>
          </div>


          {dataTable2.length > 0 ? (
            <>
              <div className="flex w-full gap-2 justify-between mb-8 flex-col sm:flex-row">
                <Card className="shadow-md sm:w-3/4">
                  <CardBody>
                    <SearchBar
                      placeHolder="Buscar Maestria"
                      searchFunction={searchObjs}
                      cleanFunction={cleanMissObjects}
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
                        checked={activeInactive === "activos"}
                        onChange={(e) => handleActiveChange(e)}
                      />
                      <span className="ml-2">Activos</span>
                    </Label>
                    <Label radio>
                      <Input
                        type="radio"
                        value="inactivos"
                        name="activeInactive"
                        checked={activeInactive === "inactivos"}
                        onChange={(e) => handleActiveChange(e)}
                      />
                      <span className="ml-2">Inactivos</span>
                    </Label>
                  </CardBody>
                </Card>
              </div>
              {dataTableSearch.length > 0 ? (
                <TableContainer className="mb-8">
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableCell>Imagen</TableCell>
                        <TableCell>Titulo</TableCell>
                        <TableCell>Modalidad</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {dataTableSearch
                        .slice(
                          (searchPage - 1) * resultsPerPage,
                          searchPage * resultsPerPage
                        )
                        .map((datos: any, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                {isValidUrl(datos.imagen) ? (
                                  <Avatar
                                    className="hidden mr-3 md:block"
                                    src={datos.imagen}
                                    size="large"
                                  />
                                ) : (
                                  <span className="text-center">-</span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <p>{datos.titulo}</p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <p>{datos.modalidad}</p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge type={datos.estado ? "success" : "danger"}>
                                <p>{datos.estado ? "Activo" : "Inactivo"}</p>
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center space-x-4">
                                {datos.estado && (
                                  <>
                                    <Link
                                      href={{
                                        pathname: `/administracion/postgradoMaestrias/editMaestria/${datos.id}`,
                                      }}
                                    >
                                      <Button
                                        layout="link"
                                        size="small"
                                        aria-label="Edit"
                                      >
                                        <EditIcon
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </Button>
                                    </Link>
                                  </>
                                )}
                                <Button
                                  layout="link"
                                  size="small"
                                  aria-label="Delete"
                                  type={"button"}
                                  onClick={() => {
                                    setShowAlert(true);
                                    setSelectedObj(datos.id);
                                  }}
                                >
                                  {datos.estado ? (
                                    <TrashIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <FaRedo
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </Button>
                                {showAlert && (
                                  <SweetAlert
                                    warning
                                    title="Atención"
                                    customButtons={
                                      <React.Fragment>
                                        <Button
                                          onClick={handleAlertCancel}
                                          className="mx-2 bg-red-600"
                                        >
                                          Cancelar
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleAlertConfirm(datos.estado)
                                          }
                                          className="mx-2 bg-green-600"
                                        >
                                          Confirmar
                                        </Button>
                                      </React.Fragment>
                                    }
                                    onConfirm={() =>
                                      handleAlertConfirm(datos.estado)
                                    }
                                    onCancel={handleAlertCancel}
                                    focusCancelBtn
                                  >
                                    {datos.estado
                                      ? "¿Está seguro de eliminar este registro?"
                                      : "¿Está seguro de recuperar este registro este registro?"}
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
                      totalResults={TotalResult}
                      resultsPerPage={resultsPerPage}
                      onChange={(p) => {
                        setSearchPage(p);
                      }}
                      label="Table navigation"
                    />
                  </TableFooter>
                </TableContainer>
              ) : (
                <SectionTitle>No se encontró inactivos</SectionTitle>
              )}
            </>
          ) : (
            <SectionTitle>No se encontraron datos</SectionTitle>
          )}
        </>
      ) : (
        <div className="mt-8">
          <PageTitle>Cargando datos...</PageTitle>
        </div>
      )}

      <ToastContainer />
    </Layout>
  );
}

export default Maestria;
