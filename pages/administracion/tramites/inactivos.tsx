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
//import { ICajasData, convertJSONListService } from "utils/demo/cajasData";
import { ITramitesData, convertJSONListService } from "utils/demo/tramitesData";
import URL from "utils/demo/api";
import Layout from "example/containers/Layout";

import SweetAlert from "react-bootstrap-sweetalert";
import { Bar } from "react-chartjs-2";
function Tramites() {
  const router = useRouter();

  const route = "Servicios/getTramiteByModuleInactive/";
  const deleteServiceRoute = "Servicios/restoreServicio/";
  const moduleName = "Tramites";
  const resultsPerPage = 10;
  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${moduleName}`)
        .then((res) => res.json())
        .then((res) => setServices(convertJSONListService(res.data)));
    }
    doFetch();
  }, []);

  const [selectedService, setSelectedService] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [pageTable, setPageTable] = useState(1);
  const [services, setServices] = useState<ITramitesData[]>([]);
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

  const handleSubmit = async () => {
    await fetch(`${URL.baseUrl}${deleteServiceRoute}${selectedService}`, {
      method: "PUT",
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
      <PageTitle>Tramites</PageTitle>

      <SectionTitle>Listado de tramites</SectionTitle>
      <TableContainer className="my-8">
        <Table>
          <TableHeader>
            <tr>
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
                        ¿Estas seguro de restablecer el tramite?
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
