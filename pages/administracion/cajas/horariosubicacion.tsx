import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { Input, Label } from "@roketid/windmill-react-ui";
import { useCallback, useEffect, useState } from "react";
import URL from "utils/demo/api";
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
import Link from "next/link";
import { useRouter } from "next/router";
import { EditIcon, TrashIcon, MenuIcon, PlusIcon } from "icons";
import SweetAlert from "react-bootstrap-sweetalert";

function horariosubicacion() {
  {
    /* Variables */
  }
  const router = useRouter();
  const [telefonos, settelefonos] = useState<IReferencesData[]>([]);
  const moduleId = 2;

  const [showAlertElimination, setShowAlertElimination] =
    useState<boolean>(false);
  const [showAlertActivate, setShowAlertActivate] = useState<boolean>(false);
  const [selectedReference, setSelectedReference] = useState<number>(0);
  const deleteReferenceRoute = "Referencia/DeleteReferences/";
  const restoreReferenceRoute = "Referencia/RestoreReferences/";
  const route = "Referencia/getReferenciasbyModuloId/";
  {
    /*Hooks*/
  }
  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${moduleId}`)
        .then((res) => res.json())
        .catch((e: any) => {
          console.log(`Error ${e}`);
        })
        .then((res) => {
          if (res.data != null) {
            settelefonos(convertJsonListToReferences(res.data));
          } else {
            settelefonos([]);
          }
        })
        .catch((e: any) => {
          console.log(`Error ${e}`);
        });
    }
    doFetch();
  }, []);

  const handleSubmitDesactivate = async () => {
    await fetch(`${URL.baseUrl}${deleteReferenceRoute}${selectedReference}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.reload();
  };
  const handleSubmitActivate = async () => {
    await fetch(`${URL.baseUrl}${restoreReferenceRoute}${selectedReference}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.reload();
  };

  interface IReferencesData {
    identificador: number;
    name: string;
    numero: number;
    status:
      | "success"
      | "danger"
      | "warning"
      | "neutral"
      | "primary"
      | undefined;
  }
  function convertJsonToReferences(data: any) {
    const convertedData: IReferencesData = {
      identificador: data.identificador,
      name: data.nombre,
      numero: data.numero,
      status: data.estado == true ? "success" : "danger",
    };
    return convertedData;
  }
  function convertJsonListToReferences(data: any) {
    const convertedListData: IReferencesData[] = [];
    data.forEach((e: any) => {
      convertedListData.push(convertJsonToReferences(e));
    });
    return convertedListData;
  }
  return (
    <Layout>
      <PageTitle>Contactos Cajas</PageTitle>
      {telefonos.length < 1 ? (
        <PageTitle>No se encuentran contactos</PageTitle>
      ) : (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Editar</TableCell>
                  <TableCell>Manejo</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {telefonos.map((e, index) => (
                  <TableRow key={index}>
                    <TableCell className="mt-1">{e.name}</TableCell>
                    <TableCell className="mt-1">{e.numero}</TableCell>
                    <TableCell>
                      <Badge
                        type={e.status == "success" ? "success" : "danger"}
                      >
                        {e.status == "success" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {e.status == "success" ? (
                        <div className="flex items-center space-x-4">
                          <Link
                            href={`/administracion/cajas/contactos/editar/[id]`}
                            as={`/administracion/cajas/contactos/editar/${e.identificador}`}
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
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </TableCell>
                    <TableCell>
                      {e.status == "success" ? (
                        <Button
                          layout="link"
                          size="small"
                          aria-label="Delete"
                          type={"button"}
                          onClick={() => {
                            setShowAlertElimination(true);
                            setSelectedReference(e.identificador);
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
                            setSelectedReference(e.identificador);
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
        </div>
      )}
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
export default horariosubicacion;
