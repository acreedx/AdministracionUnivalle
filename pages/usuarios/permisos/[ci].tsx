import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IListarModulos,
  IListarPermisos,
  IObtenerUsuario,
  IEditarUsuario,
  IEditarClave,
  IAddPermiso
} from "../../../utils/interfaces/usuarios";
import {
  Input,
  Label,
  HelperText,
  Textarea,
  Alert,
  Select,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
} from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";

import { uploadFile } from "../../../firebase/config";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { TrashIcon } from "icons";
import SweetAlert from "react-bootstrap-sweetalert/dist/components/SweetAlert";
import Link from "next/link";

function PermisosPageModal() {

  const router = useRouter();
  const {ci} = router.query;
  const strCi=ci?.toString();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [selectedObj, setSelectedObj] = useState<string>("");
  const [usuarioData, setUsuarioData] = useState<IObtenerUsuario>({
    ci: "",
    nombres: "",
    apellidos: "",
    cargo: "",
    estado:true,
  });
  const [nuevoPermisoData, setNuevoPermisoData] = useState<IAddPermiso>({
      modulo:null
  });
  const [modulosData, setModulosData] = useState<IListarModulos[]>([]);
  const [usuarioPermisosData, setUsuariosPermisosData] = useState<IListarPermisos[]>([]);
  
  
const handleChange5 = (e: ChangeEvent<HTMLSelectElement>, campo: string) => {
  setNuevoPermisoData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
};


  async function cargarDatosModulos() {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Modulos/getActiveModulos`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData: any = await res.json();
      setModulosData(resData.data);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosPermisos(userCI:any) {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Permisos/getModulosByUserCI/${userCI}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData: any = await res.json();
      setUsuariosPermisosData(resData.data[0].modulos);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosUsuario(userCI:any) {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Usuarios/getUserById/${userCI}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData: any = await res.json();
      setUsuarioData(resData.data[0]);

    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function permisos(){
    if(usuarioPermisosData.length>1){
      const aux=modulosData;
      usuarioPermisosData.map((data:any,i)=>{
        const indexModulo = aux.findIndex((ex:any)=>ex.nombre===data.modulo)
        if(indexModulo!== -1){
            aux.splice(indexModulo,1)
        }
      })
      setModulosData(aux);
    }
  }
  useEffect(() => {
    cargarDatosUsuario(strCi);
    cargarDatosModulos();
    cargarDatosPermisos(strCi);
  }, [ci]);
  
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://apisistemaunivalle.somee.com/api/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        successAlert("Éxito al quitar el permiso");
        setTimeout(() => router.reload(), 2000);
      } else {
        throw new Error();
      }
    } catch (error) {
      handleAlertCancel();
      errorAlert("Error al quitar el permiso");
    }
  };
  const handleAlertConfirm = () => {
    handleSubmit();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  const editarPermisos = () => {
    if(nuevoPermisoData.modulo==null){
      errorAlert("Error al registrar los datos no se encontro permiso")
      return;
    }
    
    const id=nuevoPermisoData.modulo.split("~#~")[0];
    const nombre=nuevoPermisoData.modulo.split("~#~")[1];

    const aux:any = usuarioPermisosData.find((ex:any)=>ex.modulo==nombre)
    if(aux!=undefined||aux!=null){
      console.log(aux);
      errorAlert("Error al registrar el permiso ya habia sido otorgado")
      return;
    }
    
    const nuevoPermiso ={
      listModulo: [
        {
          id_modulo: id
        }
      ]
    }
    fetch(`https://apisistemaunivalle.somee.com/api/Permisos/addPermisosUsuario/${strCi}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoPermiso),
    })
      .then((response) => {
        if (response.ok) {
          successAlert("Éxito al otorgar permisos");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          throw new Error("Error al cambiar los datos del servicio");
        }
      })
      .catch(() => errorAlert("Error al registrar los datos"));
  };



  return (
    <Layout>
      <PageTitle>Editar Permisos del Usuario</PageTitle>
      <SectionTitle>Datos Generales del usuario</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div>
         <div className="flex">
            <Label className="mb-2 flex-1 mr-4">
              <span className="text-lg">CI del usuario</span>
              <Input
                value={usuarioData.ci}
                className="mt-1"
                placeholder="Escriba aquí los nombres del usuario"
                disabled={true}
              />
            </Label>
            <Label className="mb-2 flex-1">
              <span className="text-lg">Cargo del usuario</span>
              <Input
                value={usuarioData.cargo}
                className="mt-1"
                placeholder="Escriba aquí los apellidos del usuario"
                disabled={true}
              />
            </Label>
          </div>
          <div className="flex">
            <Label className="mb-2 flex-1 mr-4">
              <span className="text-lg">Nombres del usuario</span>
              <Input
                value={usuarioData.nombres}
                className="mt-1"
                placeholder="Escriba aquí los nombres del usuario"
                disabled={true}
              />
            </Label>
            <Label className="mb-2 flex-1">
              <span className="text-lg">Apellidos del usuario</span>
              <Input
                value={usuarioData.apellidos}
                className="mt-1"
                placeholder="Escriba aquí los apellidos del usuario"
                disabled={true}
              />
            </Label>
          </div>
          <SectionTitle>Modulos a para otorgar permisos</SectionTitle>
          <Label className="mb-2">
            <span className="text-lg">Modulos</span>
            <Select
              className="mt-1"
              onChange={(e) => handleChange5(e, "modulo")}
            >
              {modulosData.map((datos: any, i) => (
                <option key={i} value={`${datos.identificador}~#~${datos.nombre}`}>
                  {datos.nombre}
                </option>
              ))}
            </Select>
          </Label>
          <div className="flex justify-center">
            <div className="mt-2 mx-10">
              <Button size="large" onClick={editarPermisos}>
                Otorgar Permiso
              </Button>
            </div>
            <div className="mt-2 mx-16">
              <Link
                href={{
                  pathname: `/usuarios/listarUsuarios`,
                }}
              >
                <Button size="large">Volver</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SectionTitle>Permisos Otorgados</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"> 
        <div>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell className=" font-extrabold text-sm">Nombre del modulo</TableCell>
                  {/* <TableCell>Quitar</TableCell> */}
                </tr>
              </TableHeader>
              <TableBody>
                {usuarioPermisosData.map((datos:any,i)=>(
                  <TableRow key={i}>
                    <TableCell>
                      <div>
                        <p>{datos.modulo}</p>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div>
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
                          <TrashIcon
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
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
                                    handleAlertConfirm()
                                  }
                                  className="mx-2 bg-green-600"
                                >
                                  Confirmar
                                </Button>
                              </React.Fragment>
                            }
                            onConfirm={() =>
                              handleAlertConfirm()
                            }
                            onCancel={handleAlertCancel}
                            focusCancelBtn
                          >
                            ¿Está seguro de quitar este permiso?
                          </SweetAlert>
                        )}
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))
                }
              </TableBody>
            </Table>
          </TableContainer>    
        </div>
       </div>
      <ToastContainer />
    </Layout>
  );
}

export default PermisosPageModal;