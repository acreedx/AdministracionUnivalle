import React, { useState, useEffect, ChangeEvent } from "react";
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
  Avatar,
  Card,
  CardBody,
  Input,
  Label,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon, RestoreIcon } from "icons";
//import { ICajasData, convertJSONListService } from "utils/demo/cajasData";
import { ITramitesData, convertJSONListService } from "utils/demo/tramitesData";
import URL from "utils/demo/api";
import Layout from "example/containers/Layout";

import SweetAlert from "react-bootstrap-sweetalert";
function Tramites() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const [state, setState] = useState("activos");
  const route = "Servicios/getTramiteByModuleActive/";
  const routeInactives = "Servicios/getTramiteByModuleInactive/";
  const deleteServiceRoute = "Servicios/deleteServicio/";
  const moduleName = "Tramites";
  const resultsPerPage = 10; // TODO Cambiar a 10
  const [displayedTramites, setDisplayedTramites] = useState<ITramitesData[]>([])
  /*
   useEffect(() => {
      async function doFetch() {
        fetch(`${URL.baseUrl}${state == "activos" ? route : routeInactives}${moduleName}`)
          .then((res) => res.json())
          .then((res) => setServices(convertJSONListService(res.data)));
      }
      doFetch();
    }, [state]);
  
  useEffect(() => {
    setServices(
      services.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
  }, [pageTable]);
   useEffect(() => {
      const getData = async () => {
        const query = await fetch(`${URLS.baseUrl}Publicaciones/getPublicacionesbyModuloId/4`);
        const response:any= await query.json();
        //console.log(response)
        setTotal(response.data.length);
        setMenuinfo(response.data.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage));
        //console.log(response.data)
      }
      getData();
    }, [pageTable2]);
  */
  const [pageTable, setPageTable] = useState(1);
  useEffect(() => {
    const getData = async () => {
      const query = await fetch(`${URL.baseUrl}${state == "activos" ? route : routeInactives}${moduleName}`)
        .then((res) => res.json())
        .then((res) => setServices(convertJSONListService(res.data.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))))

    }
    getData();
  }, [state, pageTable]);

  const [selectedService, setSelectedService] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [services, setServices] = useState<ITramitesData[]>([]);
  const totalResults = services.length;
  const restoreServiceRoute = "Servicios/restoreServicio/";

  function onPageChangeTable2(p: number) {
    setPageTable(p);
  }




  const handleSubmit = async () => {
    await fetch(`${URL.baseUrl}${deleteServiceRoute}${selectedService}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (state != "activos") {

      await fetch(`${URL.baseUrl}${restoreServiceRoute}${selectedService}`, {
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
  return (
    <Layout>
      <PageTitle>Tramites</PageTitle>
      <SectionTitle>Listado de tramites</SectionTitle>
      <div className="flex w-full gap-2 justify-between mb-8 flex-col sm:flex-row">
        <Card className="shadow-md sm:w-3/4">
          <CardBody>
            <input
              type="text"
              placeholder="Buscar..."
              className="mb-4 p-2 border border-gray-600 bg-gray-700 text-white w-full rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <Link href={`/administracion/tramites/crear`}>
          <Button size="small">
            Registrar un nuevo tramite
          </Button>
        </Link>
      </div>

      <TableContainer className="my-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Encargado</TableCell>
              <TableCell>Telefono de Referencia</TableCell>
              <TableCell>Duracion del tramite</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {services
              .filter((servicio) => {
                if (searchTerm === "") {
                  return servicio;
                } else if (
                  servicio.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  servicio.encharged?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  servicio.cellphone?.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return servicio;
                }
              })
              .map((servicio, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        < Avatar
                          className="hidden mr-3 md:block"
                          src={servicio.image}
                          size="large"
                        />
                      </div>
                    </div>
                  </TableCell>


                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{truncateText(servicio.name, 20)}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{truncateText(servicio.encharged, 10)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{servicio.cellphone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{servicio.duration}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{servicio.categoryId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      type={servicio.status == "success" ? "success" : "danger"}
                    >
                      {servicio.status == "success" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>

                    <div className="flex items-center space-x-4">
                      {state === "activos" ? (
                        <>
                          <Link
                            href={`/administracion/tramites/editar/[id]`}
                            as={`/administracion/tramites/editar/${servicio.id}`}
                          >
                            <Button layout="link" size="small" aria-label="Edit">
                              <EditIcon className="w-5 h-5" aria-hidden="true" />
                            </Button>
                          </Link>
                          <Button
                            layout="link"
                            size="small"
                            aria-label="Delete"
                            type="button"
                            onClick={() => {
                              setShowAlert(true);
                              setSelectedService(servicio.id);
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
                            setSelectedService(servicio.id);
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
                          {state == "activos" ? "¿Estás seguro de eliminar este Trámite?" : "¿Estás seguro de restaurar este Trámite?"}
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

export default Tramites;
