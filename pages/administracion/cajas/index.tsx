import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableFooter,
  Pagination,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Badge,
  Button,
  Label,
  Input,
  CardBody,
  Card,
  Avatar,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon, PlusIcon } from "icons";
import { ICajasData } from "utils/demo/cajasData";
import Layout from "example/containers/Layout";
import SweetAlert from "react-bootstrap-sweetalert";
import SearchBar from "components/searchBar";
import servicesProvider from "../../../utils/providers/servicesProvider";

function Cajas() {
  const router = useRouter();
  const [state, setState] = useState("");
  const resultsPerPage = 10;
  const [services, setServices] = useState<ICajasData[]>([]);
  const [servicesOriginal, setServicesOriginal] = useState<ICajasData[]>([]);
  useEffect(() => {
    async function doFetch() {
      setServices(await servicesProvider.ServicesList());
      setServicesOriginal(await servicesProvider.ServicesList());
    }
    doFetch();
  }, []);

  const [selectedService, setSelectedService] = useState<number>(0);
  const [showAlertElimination, setShowAlertElimination] =
    useState<boolean>(false);
  const [showAlertActivate, setShowAlertActivate] = useState<boolean>(false);
  const [pageTable, setPageTable] = useState(1);
  const totalResults = services.length;

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

  const handleSubmitDesactivate = async () => {
    await servicesProvider.DeleteService(selectedService);
    router.reload();
  };
  const handleSubmitActivate = async () => {
    await servicesProvider.RestoreService(selectedService);
    router.reload();
  };
  const handleActiveChange = (e: any) => {
    setState(e.target.value);
    const filtro = servicesOriginal.filter(
      (cont) => cont.status == e.target.value
    );
    setServices(filtro);
  };
  const filterServices = (e: any) => {
    if (state == "success" || state == "danger") {
      const filtro = servicesOriginal
        .filter((cont) => cont.status == state)
        .filter((cont) => cont.name.includes(e));
      setServices(filtro);
      return;
    }
    if (e && e.trim() !== "") {
      const filtro = servicesOriginal.filter((cont) => cont.name.includes(e));
      setServices(filtro);
      return;
    }
    setServices(servicesOriginal);
  };
  return (
    <Layout>
      <PageTitle>Cajas</PageTitle>
      <div className="mb-8">
        <Link href="/administracion/cajas/crear">
          <Button size="large">Registrar servicio</Button>
        </Link>
      </div>
      <SectionTitle>Listado de servicios de cajas</SectionTitle>
      <div className="flex w-full gap-2 justify-between mb-8 flex-col sm:flex-row">
        <Card className="shadow-md sm:w-3/4">
          <CardBody>
            <SearchBar
              placeHolder="Buscar servicio de cajas"
              searchFunction={(e: any) => {
                filterServices(e);
              }}
              cleanFunction={() => {
                filterServices("");
              }}
            />
          </CardBody>
        </Card>
        <Card className="shadow-md sm:w-1/4 flex flex-col justify-center items-center">
          <CardBody className="flex justify-center items-start gap-y-2 gap-x-4 flex-row sm:flex-col lg:flex-row">
            <Label radio>
              <Input
                type="radio"
                value="success"
                name="activeInactive"
                checked={state === "success"}
                onChange={(e) => handleActiveChange(e)}
              />
              <span className="ml-2">Activos</span>
            </Label>
            <Label radio>
              <Input
                type="radio"
                value="danger"
                name="activeInactive"
                checked={state === "danger"}
                onChange={(e) => handleActiveChange(e)}
              />
              <span className="ml-2">Inactivos</span>
            </Label>
          </CardBody>
        </Card>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Imagen</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Encargado</TableCell>
              <TableCell>Telefono de Referencia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Manejo</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {services.map((servicio, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <Avatar
                        className="hidden mr-3 md:block"
                        src={servicio.imagenUrl}
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
                  <Badge
                    type={servicio.status == "success" ? "success" : "danger"}
                  >
                    {servicio.status == "success" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {servicio.status == "success" ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/administracion/cajas/editar/[id]`}
                        as={`/administracion/cajas/editar/${servicio.id}`}
                      >
                        <Button layout="link" size="small" aria-label="Edit">
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </TableCell>
                <TableCell>
                  {servicio.status == "success" ? (
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      type={"button"}
                      onClick={() => {
                        setShowAlertElimination(true);
                        setSelectedService(servicio.id);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      layout="link"
                      size="small"
                      aria-label="Delete"
                      type={"button"}
                      onClick={() => {
                        setShowAlertActivate(true);
                        setSelectedService(servicio.id);
                      }}
                    >
                      <PlusIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*Alerta 1 - Activar Servicio*/}
      {showAlertActivate && (
        <SweetAlert
          success
          title="Atención"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          showCancel
          onConfirm={() => {
            handleSubmitActivate();
          }}
          onCancel={() => {
            setShowAlertActivate(false);
          }}
        >
          Esta seguro que quiere activar este servicio?
        </SweetAlert>
      )}
      {/*Alerta 2 - Desactivar Servicio*/}
      {showAlertElimination && (
        <SweetAlert
          error
          title="Atención"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          showCancel
          onConfirm={() => {
            handleSubmitDesactivate();
          }}
          onCancel={() => {
            setShowAlertElimination(false);
          }}
        >
          Esta seguro que quiere desactivar este servicio?
        </SweetAlert>
      )}
    </Layout>
  );
}

export default Cajas;
