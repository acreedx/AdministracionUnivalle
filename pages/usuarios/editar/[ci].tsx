import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IListarCargos,
  IListarUsuario,
  IObtenerUsuario,
  IEditarUsuario,
  IEditarClave
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

function EditarUsuarioPageModal() {

  const [nameValid, setNameValid] = useState<boolean | undefined>(undefined);
  const [nameText, setNameValidText] = useState<string>("");

  const [lastNameValid, setlastNameValid] = useState<boolean | undefined>(undefined);
  const [lastNameText, setlastNameValidText] = useState<string>("");
  
  const [claveValid, setClaveValid] = useState<boolean | undefined>(undefined);
  const [claveText, setClaveText] = useState<string>("");

  const [claveConfValid, setClaveConfValid] = useState<boolean | undefined>(undefined);
  const [claveConfText, setClaveConfText] = useState<string>("");


  const router = useRouter();
  const {ci} = router.query;
  const strCi=ci?.toString();

  const [usuarioData, setUsuarioData] = useState<IObtenerUsuario>({
    ci: "",
    nombres: "",
    apellidos: "",
    cargo: "",
    estado:true,
  });
  const [usuarioBkData, setUsuarioBkData] = useState<IObtenerUsuario>({
    ci: "",
    nombres: "",
    apellidos: "",
    cargo: "",
    estado:true,
  });
  const [nuevoUsuarioData, setNuevoUsuarioData] = useState<IEditarUsuario>({
    nombres: "",
    apellidos: "",
  });
  const [nuevaClaveData, setNuevaClaveData] = useState<IEditarClave>({
    newPassword: "",
  });
  const [cargosData, setCargosData] = useState<IListarCargos[]>([]);
  const [usuariosData, setUsuariosData] = useState<IListarUsuario[]>([]);
  const handleChange2 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
     if(campo=="nombres"){
      if (e.target.value.length >100) {
      setNameValid(false);
      setNameValidText("Los nombres del usuario no puede superar los 100 caracteres");
      }else{
        if(onlyLetersAndNumbers(e.target.value)){        
          setNameValid(true);
          setNameValidText("Los nombres del usuario ingresados son validos");    
        } else{
          setNameValid(false);
          setNameValidText("Los nombres del usuario no deben contener caracteres especiales");
        }
      }
      if (e.target.value.length == 0) {
        setNameValid(undefined);
        setNameValidText("");
      }
    }else if(campo=="apellidos"){
      if (e.target.value.length >100) {
      setlastNameValid(false);
      setlastNameValidText("El apellido del usuario no puede superar los 100 caracteres");
      }else{
        if(onlyLetersAndNumbers(e.target.value)){        
          setlastNameValid(true);
          setlastNameValidText("Los apellidos del usuario ingresados son validos");    
        } else{
          setlastNameValid(false);
          setlastNameValidText("Los apellidos del usuario no deben contener caracteres especiales");
        }
      }
      if (e.target.value.length == 0) {
        setlastNameValid(undefined);
        setlastNameValidText("");
      }
    }
    setUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
  
  };
  const handleChange3 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    if(campo=="newPassword"){
      if(e.target.value.length>50){
        setClaveValid(false)
        setClaveText("La contraseña no puede superar los 50 caracteres")
      }else{
        if(e.target.value.length<5){
          setClaveValid(false)
          setClaveText("La contraseña no puede ser menor a los 5 caracteres")
        }else{
          setClaveValid(true)
          setClaveText("Contraseña valida")
        }
      }
    }

    setNuevaClaveData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    console.log(nuevoUsuarioData);
  };
  const handleChange5 = (e: ChangeEvent<HTMLSelectElement>, campo: string) => {
    setNuevoUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    
  };
  const handleChange4 = (e: ChangeEvent<HTMLInputElement>) => {
   if(e.target.value==nuevaClaveData.newPassword){
      setClaveConfValid(true);
      setClaveConfText("La contraseña coincide");
    }else{
      setClaveConfValid(false);
      setClaveConfText("La contraseña no coincide");
    }
    if(e.target.value.length==0){
      setClaveConfValid(undefined);
      setClaveConfText("");
    }
    console.log(nuevaClaveData.newPassword)
  };
  function onlyNumbers(str: string) {
    return /^[0-9]*$/.test(str);
  }
  function onlyLetersAndNumbers(str: string) {
    return /^[A-Za-z0-9ñáéíóúü ]*$/.test(str);
  }
  const clearData = () => {
    setUsuarioData(usuarioBkData);
  };

  async function cargarDatosCargos() {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Cargos/getActiveCargos`
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
        `https://apisistemaunivalle.somee.com/api/Usuarios/getAllUsers`
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
      setUsuarioBkData(resData.data[0])
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  useEffect(() => {
    
    cargarDatosUsuario(strCi);
    cargarDatosCargos();
    cargarDatosUsuarios();
  }, [ci]);

  const editarUsuario = () => {
     if(nameValid==false){
      errorAlert("Error al registrar Nombres no validos");
      return;
    }
    if(lastNameValid==false){
      errorAlert("Error al registrar Apellidos no validos");
      return;
    }

    nuevoUsuarioData.nombres=usuarioData.nombres;
    nuevoUsuarioData.apellidos=usuarioData.apellidos;
    fetch(`https://apisistemaunivalle.somee.com/api/Usuarios/updateUser/${strCi}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuarioData),
    })
      .then((response) => {
        if (response.ok) {
          successAlert("Éxito al editar los datos");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          throw new Error("Error al cambiar los datos del servicio");
        }
      })
      .catch(() => errorAlert("Error al registrar los datos"));
  };

  const editarClave = () => {
    if(claveValid==false || claveConfValid==false){
      errorAlert("Error al editar contraseña no valida");
      return;
    }
    
    fetch(`https://apisistemaunivalle.somee.com/api/Usuarios/changePassword/${strCi}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaClaveData),
    })
      .then((response) => {
        if (response.ok) {
          successAlert("Éxito al cambiar la contraseña");
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
      <PageTitle>Editar Datos Usuario</PageTitle>
      <SectionTitle>Datos Generales del usuario</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div>
          <Label className=" mb-2">
            <span className="text-lg">CI del usuario</span>
            <Input
              value={usuarioData.ci}
              className="mt-1"
              placeholder="Escriba aquí el ci del servicio"
              disabled={true}
            />
        
          </Label>
          
          
          <Label className=" mb-2">
            <span className="text-lg">Nombres del usuario</span>
            <Input
              value={usuarioData.nombres}
              className="mt-1"
              placeholder="Escriba aquí los nombres del usuario"
              onChange={(e) => handleChange2(e, "nombres")}
              valid={nameValid}
            />
            {nameValid != null && (
            <HelperText valid={nameValid}>{nameText}</HelperText>
            )}
          </Label>
          <Label className=" mb-2">
            <span className="text-lg">Apellidos del usuario</span>
            <Input
              value={usuarioData.apellidos}
              className="mt-1"
              placeholder="Escriba aquí los apellidos del usuario"
              onChange={(e) => handleChange2(e, "apellidos")}
              valid={lastNameValid}
            />
            {lastNameValid != null && (
            <HelperText valid={lastNameValid}>{lastNameText}</HelperText>
            )}
          </Label>
          {/* <Label className=" mb-2">
            <span className="text-lg">Cargo del usuario</span>
            <Select 
            //value={usuarioData.cargo}
            className="mt-1" onChange={(e) => handleChange5(e, "cargoId")}>
              {cargosData.map((datos: any, i) => (
                <option key={i} value={datos.id}>
                  {datos.nombrecargo}
                </option>
              ))}
            </Select>
          </Label> */}
          <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
          <div>
            <Button size="large" onClick={editarUsuario}>
              Editar
            </Button>
          </div>
          <div>
            <Button size="large" onClick={clearData}>
              Limpiar campos
            </Button>
          </div>

          
        </div>
        </div>
        </div>
        <SectionTitle>Cambiar contraseña del Usuario</SectionTitle>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div>
            <Label className=" mb-2">
            <span className="text-lg">Contraseña</span>
            <Input
              type="password"
              value={nuevaClaveData.newPassword}
              className="mt-1"
              placeholder="Escriba aquí la contraseña del usuario"
              onChange={(e) => handleChange3(e, "newPassword")}
              valid={claveValid}
            />
            {claveValid != null && (
            <HelperText valid={claveValid}>{claveText}</HelperText>
            )}
          </Label>
          
          <Label className=" mb-2">
            <span className="text-lg">Confirmar contraseña</span>
            <Input
              type="password"
              className="mt-1"
              placeholder="Vuelva a escribir la contraseña"
              onChange={(e) => handleChange4(e)}
              valid={claveConfValid}
            />
            {claveConfValid != null && (
            <HelperText valid={claveConfValid}>{claveConfText}</HelperText>
            )}
          </Label>
          <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">

          <div>
            <Button size="large" onClick={editarClave}>
              Editar Contraseña
            </Button>
          </div>
        </div>
          </div>
        </div>
        
        
        <ToastContainer />
    </Layout>
  );
}

export default EditarUsuarioPageModal;
