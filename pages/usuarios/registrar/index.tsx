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
import Link from "next/link";

function RegistrarUsuarioPageModal() {
  const [ciValid, setCiValid] = useState<boolean | undefined>(undefined);
  const [CiText, setCiValidText] = useState<string>("");

  const [nameValid, setNameValid] = useState<boolean | undefined>(undefined);
  const [nameText, setNameValidText] = useState<string>("");

  const [lastNameValid, setlastNameValid] = useState<boolean | undefined>(undefined);
  const [lastNameText, setlastNameValidText] = useState<string>("");
  
  const [claveValid, setClaveValid] = useState<boolean | undefined>(undefined);
  const [claveText, setClaveText] = useState<string>("");

  const [claveConfValid, setClaveConfValid] = useState<boolean | undefined>(undefined);
  const [claveConfText, setClaveConfText] = useState<string>("");

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
    }else if(campo=="clave"){
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

      if (e.target.value.length == 0) {
        setClaveValid(undefined);
        setClaveText("");
      }
    }
    
    setUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    console.log(usuarioData);
  };
  
  const handleChange3 = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.value==usuarioData.clave){
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
  };
  


  const handleChange1 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
     if (e.target.value.length >8) {
      setCiValid(false);
      setCiValidText("El carnet de identidad no puede superar los 8 digitos");
    }else{
      if(onlyNumbers(e.target.value)){        
        const aux:any=usuariosData.find((element:any)=>element.ci==e.target.value);
        if(aux==undefined){
            setCiValid(true);
            setCiValidText("Carnet de identidad ingresado valido");
          }else{
            setCiValid(false);
            setCiValidText("El carnet de identidad ya esta registrado");
          }
      } else{
        setCiValid(false);
        setCiValidText("El nombre solo debe contener números");
      }
    }
    if (e.target.value.length == 0) {
      setCiValid(undefined);
      setCiValidText("");
    }

    setUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }))
  };
  const handleChange5 = (e: ChangeEvent<HTMLSelectElement>, campo: string) => {
    setUsuarioData((prevData: any) => ({
      ...prevData,
      [campo]: e.target.value,
    }));
    
  };
  function onlyNumbers(str: string) {
    return /^[0-9]*$/.test(str);
  }
  function onlyLetersAndNumbers(str: string) {
    return /^[A-Za-z0-9ñáéíóúü ]*$/.test(str);
  }
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
        `https://apisistemaunivalle.somee.com/api/Cargos/getActiveCargos`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData: any = await res.json();
      setCargosData(resData.data);
      setUsuarioData(
        {
        ciUsuario: "",
        clave: "",
        nombres: "",
        apellidos: "",
        cargoId:resData.data[0].id
      }
      )
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
  useEffect(() => {
    cargarDatosCargos();
    cargarDatosUsuarios();
  }, []);

  const registrarServicio = () => {
    if(!ciValid){
      errorAlert("Error al registrar CI no valido");
      return;
    }
    if(!nameValid){
      errorAlert("Error al registrar Nombres no validos");
      return;
    }
    if(!lastNameValid){
      errorAlert("Error al registrar Apellidos no validos");
      return;
    }
    if(!claveValid || !claveConfValid){
      errorAlert("Error al registrar contraseña no valida");
      return;
    }
    fetch("https://apisistemaunivalle.somee.com/api/Usuarios/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    })
      .then(async(response) => {
        if (response.ok) {
          const res:any= await response.json();
          successAlert("Éxito al registrar los datos");
          setTimeout(() => {
            router.push(`/usuarios/permisos/${res.data.ciUsuario}`);
          }, 2000);
        } else {
          throw new Error("Error al cambiar los datos del servicio");
        }
      })
      .catch(() => errorAlert("Error al registrar los datos"));
  };

  return (
    <Layout>
      <PageTitle>Registrar Usuario</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        
        <SectionTitle>Datos Generales del usuario</SectionTitle>

        <div>
          <Label className=" mb-2">
            <span className="text-lg">CI del usuario</span>
            <Input
              value={usuarioData.ciUsuario}
              className="mt-1"
              placeholder="Escriba aquí el ci del servicio"
              onChange={(e) => handleChange1(e, "ciUsuario")}
              valid={ciValid}
            />
            {ciValid != null && (
            <HelperText valid={ciValid}>{CiText}</HelperText>
            )}

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
          <Label className=" mb-2">
            <span className="text-lg">Cargo del usuario</span>
            <Select value={usuarioData.cargoId}
            className="mt-1" onChange={(e) => handleChange5(e, "cargoId")}>
              {cargosData.map((datos: any, i) => (
                <option key={i} value={datos.id}>
                  {datos.nombrecargo}
                </option>
              ))}
            </Select>
          </Label>
        </div>
        </div>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <SectionTitle>Contraseña del Usuario</SectionTitle>
          <div>
            <Label className=" mb-2">
            <span className="text-lg">Contraseña</span>
            <Input
              type="password"
              value={usuarioData.clave}
              className="mt-1"
              placeholder="Escriba aquí la contraseña del usuario"
              onChange={(e) => handleChange2(e, "clave")}
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
              onChange={(e) => handleChange3(e)}
              valid={claveConfValid}
            />
            {claveConfValid != null && (
            <HelperText valid={claveConfValid}>{claveConfText}</HelperText>
            )}
          </Label>
          </div>
        </div>
        
        <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
          <div>
            <Button size="large" onClick={registrarServicio}>
              Registrar
            </Button>
          </div>
          <div>
            <Button size="large" onClick={clearData}>
              Limpiar campos
            </Button>
          </div>
          <div>
          <Link href={{
            pathname: `/usuarios/listarUsuarios`,
          }}>
          <Button size="large">Volver</Button>
          </Link>
        </div>    
          
        </div>
        <ToastContainer />
    </Layout>
  );
}

export default RegistrarUsuarioPageModal;
