import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IRegistrarUsuario,
  IListarCargos,
  IListarUsuario,
} from "../../../utils/interfaces/usuarios";
import {
  Input,
  Label,
  HelperText,
  Textarea,
  Alert,
  Select,
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

function RegistrarUsuarioPageModal() {
  const [ciValid, setValid]: any = useState();

  const router = useRouter();
  const [usuarioData, setUsuarioData] = useState<IRegistrarUsuario>({
    ciUsuario: "",
    clave: "",
    nombres: "",
    apellidos: "",
    cargoId: 0,
  });
  const [cargosData, setCargosData] = useState<IListarCargos[]>([]);
  const [usuariosData, setUsuariosData] = useState<IListarUsuario[]>([]);
  const handleChange2 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    console.log(usuarioData);
  };
  const handleChange1 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    e.preventDefault();

    setUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));

    if (usuarioData.ciUsuario == "") {
      setValid(null);
    } else {
      usuariosData.every((data: any) => {
        if (data.ci == usuarioData.ciUsuario) {
          setValid(false);
          return false;
        }
        if (data.ci != usuarioData.ciUsuario) {
          setValid(true);
        }
      });
    }

    // usuariosData.map((data: any) => {
    //   // data.ci == usuarioData.ciUsuario
    //   //   ? setValid(false)
    //   //   : usuarioData.ciUsuario === ""
    //   //   ? setValid(null)
    //   //   : data.ci !== usuarioData.ciUsuario && usuarioData.ciUsuario !== ""
    //   //   ? setValid(true)
    //   //   : setValid(null);
    // });

    console.log(ciValid);
    console.log(usuarioData.ciUsuario);
  };
  const clearData = () => {
    setUsuarioData({
      ...usuarioData,
      ciUsuario: "",
      clave: "",
      nombres: "",
      apellidos: "",
      cargoId: 0,
    });
  };

  async function cargarDatosCargos() {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Cargos/getActiveCargos`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData: any = await res.json();
      setCargosData(resData.data);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosUsuarios() {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Usuarios/getAllUsers`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData: any = await res.json();
      setUsuariosData(resData.data);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  useEffect(() => {
    cargarDatosCargos();
    cargarDatosUsuarios();
  }, []);

  const registrarServicio = () => {
    fetch("http://apisistemaunivalle.somee.com/api/Servicios/addServicio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    })
      .then((response) => {
        if (response.ok) {
          successAlert("Éxito al registrar los datos");
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
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <PageTitle>Registrar Usuario</PageTitle>
        <SectionTitle>Datos Generales del usuario</SectionTitle>

        <div>
          <Label className=" mb-2">
            <span className="text-lg">CI del usuario</span>
            <Input
              value={usuarioData.ciUsuario}
              className="mt-1"
              placeholder="Escriba aquí el ci del servicio"
              onChange={(e) => handleChange1(e, "ciUsuario")}
              //valid={ciValid===true? ciValid :ciValid===false? ciValid: null}
            />
            {ciValid === true ? (
              <HelperText valid={ciValid}>
                Es un carnet de identidad válido
              </HelperText>
            ) : ciValid === false ? (
              <HelperText valid={ciValid}>
                Este carnet de identidad ya existe
              </HelperText>
            ) : ciValid === null ? (
              <HelperText>El carnet de identidad debe ser unico</HelperText>
            ) : (
              <HelperText>El carnet de identidad debe ser unico</HelperText>
            )}
          </Label>
          <Label className=" mb-2">
            <span className="text-lg">Contraseña del usuario</span>
            <Input
              value={usuarioData.clave}
              className="mt-1"
              placeholder="Escriba aquí la contraseña del usuario"
              onChange={(e) => handleChange2(e, "clave")}
            />
          </Label>
          <Label className=" mb-2">
            <span className="text-lg">Confirmar contraseña</span>
            <Input
              className="mt-1"
              placeholder="Vuelva a escribir la contraseña"
              // onChange={(e) => handleChange2(e, "ciUsuario")}
            />
          </Label>
          <Label className=" mb-2">
            <span className="text-lg">Nombres del usuario</span>
            <Input
              value={usuarioData.nombres}
              className="mt-1"
              placeholder="Escriba aquí los nombres del usuario"
              onChange={(e) => handleChange2(e, "nombres")}
            />
          </Label>
          <Label className=" mb-2">
            <span className="text-lg">Apellidos del usuario</span>
            <Input
              value={usuarioData.apellidos}
              className="mt-1"
              placeholder="Escriba aquí los apellidos del usuario"
              onChange={(e) => handleChange2(e, "apellidos")}
            />
          </Label>
          <Label className=" mb-2">
            <span className="text-lg">Cargo del usuario</span>
            <Select className="mt-1">
              {cargosData.map((datos: any, i) => (
                <option key={i} value={datos.id}>
                  {datos.nombrecargo}
                </option>
              ))}
            </Select>
          </Label>
        </div>
        <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
          <div>
            <Button size="large" onClick={clearData}>
              Limpiar campos
            </Button>
          </div>

          <div>
            <Button size="large" onClick={registrarServicio}>
              Registrar
            </Button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default RegistrarUsuarioPageModal;
