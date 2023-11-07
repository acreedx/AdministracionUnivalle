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
import { EditIcon, TrashIcon, MenuIcon } from "icons";
//import { ICajasData, convertJSONListService } from "utils/demo/cajasData";
import { ITramitesData, convertJSONListService } from "utils/demo/tramitesData";
import URL from "utils/demo/api";
import Layout from "example/containers/Layout";

import SweetAlert from "react-bootstrap-sweetalert";
function Tramites() {
  const router = useRouter();
  const [state, setState] = useState("activos");
  const route = "Servicios/getTramiteByModuleActive/";
  const routeInactives = "Servicios/getTramiteByModuleInactive/";
  const deleteServiceRoute = "Servicios/deleteServicio/";
  const moduleName = "Tramites";
  const resultsPerPage = 10;

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${state == "activos" ? route : routeInactives}${moduleName}`)
        .then((res) => res.json())
        .then((res) => setServices(convertJSONListService(res.data)));
    }
    doFetch();
  }, [state]);

  const [selectedService, setSelectedService] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [pageTable, setPageTable] = useState(1);
  const [services, setServices] = useState<ITramitesData[]>([]);
  const totalResults = services.length;
  const restoreServiceRoute = "Servicios/restoreServicio/";
  function onPageChangeTable2(p: number) {
    setPageTable(p);
  }

  useEffect(() => {
    setServices(
      services.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
  }, [pageTable]);

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

  return (
    <Layout>
      <PageTitle>Tramites</PageTitle>

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
      <SectionTitle>Listado de tramites</SectionTitle>
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
              <TableCell>Estado</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {services.map((servicio, i) => (
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
                      <p className="font-semibold">{servicio.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{servicio.encharged}</p>
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
