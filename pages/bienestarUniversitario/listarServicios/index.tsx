import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";
import SweetAlert from "react-bootstrap-sweetalert";
import { IListarServicios } from "utils/interfaces/servicios";
import Layout from "example/containers/Layout";
import Link from "next/link";
import { isValidUrl } from "utils/functions/url";
import { errorAlert } from "components/alerts";
import { ToastContainer } from "react-toastify";

function BienestarUniversitario() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<number>(0);
  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable2, setUserInfo] = useState<IListarServicios[]>([]);
  const [TotalResult, setTotal] = useState(Number);

  const resultsPerPage = 10;

  const [showAlert, setShowAlert] = useState<boolean>(false);

  function onPageChangeTable2(p: number) {
    setPageTable2(p);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const query = await fetch(
          "http://apisistemaunivalle.somee.com/api/Servicios/getServicioByModuloId/1"
        );
        if (query.ok) {
          const response: any = await query.json();
          setTotal(response.data.length);
          setUserInfo(
            response.data.slice(
              (pageTable2 - 1) * resultsPerPage,
              pageTable2 * resultsPerPage
            )
          );
        } else {
          throw new Error();
        }
      } catch (e) {
        console.log(e);
        errorAlert("Ocurrió un error al traer los datos");
      }
    };
    getData();
  }, [pageTable2]);

  const handleSubmit = async () => {
    await fetch(
      `http://apisistemaunivalle.somee.com/api/Servicios/deleteServicio/${selectedService}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
      <PageTitle>Listar Servicios - Bienestar Universitario</PageTitle>
      <div className="mb-8">
        <Link href="/bienestarUniversitario/registrar">
          <Button size="large">Registrar servicio</Button>
        </Link>
      </div>
      {dataTable2.length > 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Modulo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {dataTable2.map((datos: any, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {isValidUrl(datos.archivo) ? (
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={datos.archivo}
                          size="large"
                        />
                      ) : (
                        <span className="text-center">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{datos.nombre}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{datos.modulo}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type={datos.estado ? "success" : "danger"}>
                      <p>{datos.estado ? "Activo" : "Inactivo"}</p>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Link
                        href={{
                          pathname: `/bienestarUniversitario/editar/${datos.identificador}`,
                        }}
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
                          setSelectedService(datos.identificador);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      {showAlert && (
                        <SweetAlert
                          warning // Puedes personalizar el tipo de alerta (success, error, warning, etc.)
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
                                onClick={handleAlertConfirm}
                                className="mx-2 bg-green-600"
                              >
                                Confirmar
                              </Button>
                            </React.Fragment>
                          }
                          onConfirm={handleAlertConfirm}
                          onCancel={handleAlertCancel}
                          focusCancelBtn
                        >
                          ¿Está seguro de eliminar este registro?
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
              onChange={onPageChangeTable2}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <SectionTitle>No se encontraron datos</SectionTitle>
      )}
      <ToastContainer />
    </Layout>
  );
}

export default BienestarUniversitario;
