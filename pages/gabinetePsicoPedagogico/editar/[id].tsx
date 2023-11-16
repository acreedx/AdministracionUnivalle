import React, { useState, ChangeEvent, useEffect, TextareaHTMLAttributes } from "react";
import { 
  IEditarServicio,
  IEditarUbicacion,
  IEditarReferenciaArray,
  IEditarRequisitosArray, 
  IEditarHorarioArray
} from "../../../utils/interfaces/servicios";
import { Input, Label, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import { useRouter } from "next/router";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";
import { ToastContainer } from "react-toastify";
import {uploadFile} from "../../../firebase/config"
import ReferenciaInputs from "../../../components/referenciasInput"
import RequisitoInputs from "../../../components/requisitosInput"
import RequisitoPasosInputs from "../../../components/requisitoPasosInput"
import Image from 'next/image'
import VideoPlayer from "components/video_player";
import Modal from '../../../components/modal'
import EliminarReferencia from "../eliminarDatos/referenciaDel";
import EliminarRequisitos from "../eliminarDatos/requisitosServDel";
import Link from "next/link";
import EliminarHorario from "../eliminarDatos/horariosDel";
import HorariosInputs from "components/horariosInput";
export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function EditarServicioPage() {
  const baseURL="https://apisistemaunivalle.somee.com/api";
  var countReq=-1;
  var countHor=-1;
  const [ubicacionImg,setUImg]:any = useState(null)
  const [ubicaionVideo,setUVideo]:any = useState(null)
  const [serviceImg, setImg]: any = useState(null);


  const [moduloData, setModuloData] = useState<IEditarServicio>({
    nombre: "",
    imagenUrl:null
  });
  const [moduloBkData, setModuloBkData] = useState<IEditarServicio>({
    nombre: "",
    imagenUrl:null
  });
  const [ubicacionData, setUbicacionData] = useState<IEditarUbicacion>({
    identificador:0,
    descripcion: null,
    imagen: null,
    video:null,
  });
  const [ubicacionBkData, setUbicacionBkData] = useState<IEditarUbicacion>({
    identificador:0,
    descripcion: null,
    imagen: null,
    video:null,
  });
  const [requisitosData, setRequisitosData] = useState<IEditarRequisitosArray>({
    data:[
      { 
        identificador:0,
        descripcion: null,
        pasosRequisito:
        [ 
          {
            identificador:0,
            nombre:null
          }
        ]
      }
    ] 
  });
  const [requisitosBkData, setRequisitosBkData] = useState<IEditarRequisitosArray>({
     data:[
      { 
        identificador:0,
        descripcion: null,
        pasosRequisito:
        [ 
          {
            identificador:0,
            nombre:null
          }
        ]
        
      }
    ] 
  });
  const [referenciaData, setReferenciaData] = useState<IEditarReferenciaArray>({
    data:
    [
      {
        identificador:0,
        nombre: null,
        numero: null,
      } 
    ]
  });
  const [refereciaBkData, setReferenciaBkData] = useState<IEditarReferenciaArray>({
    data:
    [
      {
        identificador:0,
        nombre: null,
        numero: null,
      } 
    ]
  });
  const [horariosData,setHorariosData]= useState<IEditarHorarioArray>({
    data:
    [
      {
        idHorarios: 0,
        horaInicio: "",
        horaFin: "",
        modulo: null,
        servicio: null,
        estado: true,
        diasAtencion:
        [
          {
            idAtencion:0,
            nombreDia:null
          }
        ]
      }
    ]
  });
   const [horariosBkData,setHorariosBkData]= useState<IEditarHorarioArray>({
    data:
    [
      {
        idHorarios: 0,
        horaInicio: "",
        horaFin: "",
        modulo: null,
        servicio: null,
        estado: true,
        diasAtencion:
        [
          {
            idAtencion:0,
            nombreDia:""
          }
        ]
      }
    ]
  });
  const router = useRouter();
  const { id } = router.query;
  const numId = parseInt(id as string, 10);
  
  async function cargarDatosModulo(id: number) {
    try {
      const res = await fetch(
        `${baseURL}/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData = await res.json();
      setModuloBkData({
        nombre: resData.data[0].nombre,
        imagenUrl: resData.data[0].imagenUrl,
      });
      setModuloData({
        nombre: resData.data[0].nombre,
        imagenUrl: resData.data[0].imagenUrl,
      });
      console.log(moduloData);
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }
async function cargarDatosUbicacion(id: number) {
    try {
      const res = await fetch(
        `${baseURL}/Ubicaciones/getUbicacionesbyServicioId/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos de la ubicación.");
      }
      const resData = await res.json();

      setUbicacionBkData({
        identificador:resData.data[0].identificador,
        descripcion: resData.data[0].descripcion,
        imagen: resData.data[0].imagen,
        video:resData.data[0].video,
      });
      setUbicacionData({
        identificador:resData.data[0].identificador,
        descripcion: resData.data[0].descripcion,
        imagen: resData.data[0].imagen,
        video:resData.data[0].video,
      });
      console.log(ubicacionData);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosRequisitos(id: number) {
    try {
      const res = await fetch(
        `${baseURL}/Requisitos/getRequisitosByServiceId/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setRequisitosBkData({
        data: resData.data,
      });
      setRequisitosData({
        data: resData.data,
      });
      
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
    
  }
  async function cargarDatosReferencia(id: number) {
    try {
      const res = await fetch(
        `${baseURL}/Referencia/getReferenciasbyServicioId/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setReferenciaBkData({
        data:resData.data,
      });
      setReferenciaData({
        data:resData.data,
      });
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosHorario(id: number) {
    try {
      const res = await fetch(
        `${baseURL}/Horarios/getHorariosbyServicioId/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setHorariosBkData({
        data:resData.data,
      });
      setHorariosData({
        data:resData.data,
      });
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  useEffect(() => {
    cargarDatosModulo(numId);
    cargarDatosUbicacion(numId);
    cargarDatosRequisitos(numId);
    cargarDatosReferencia(numId);
    cargarDatosHorario(numId);
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setModuloData({
      ...moduloData,
      [campo]: e.target.value,
    });
  };
const handleChange1 = (e: ChangeEvent<HTMLTextAreaElement>, id: number, pasoId: number, campo: string) => {
  setRequisitosData((prevData: any) => {
    const newData = prevData.data.map((requisito: any) => {
      if (requisito.identificador === id) {
        const updatedPasos = requisito.pasosRequisito.map((paso: any) => {
          if (paso.identificador === pasoId) {
            return {
              ...paso,
              [campo]: e.target.value,
            };
          }
          return paso;
        });

        return {
          ...requisito,
          pasosRequisito: updatedPasos,
        };
      }
      return requisito;
    });

    return { data: newData };
  });
  console.log(requisitosData.data);
};
const handleChange2 = (e: ChangeEvent<HTMLInputElement>, id:number ,campo: string) => {
      setRequisitosData((prevData:any) => {
      const newData = prevData.data.map((item:any) => {
        if (item.identificador === id) {
          // Clona el objeto original y actualiza la propiedad especificada
          return {
            ...item,
            [campo]: e.target.value,
          };
        }
        return item;
        });

        return { data: newData };
      });
      console.log(requisitosData.data);
  };
  const handleChange3 = (e: ChangeEvent<HTMLInputElement>, id:number ,campo: string) => {
      setReferenciaData((prevData:any) => {
      const newData = prevData.data.map((item:any) => {
        if (item.identificador === id) {
          // Clona el objeto original y actualiza la propiedad especificada
          return {
            ...item,
            [campo]: e.target.value,
          };
        }
        return item;
        });

        return { data: newData };
      });
      console.log(referenciaData.data);
  };
  const handleChange4 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setUbicacionData({
      ...ubicacionData,
      [campo]: e.target.value,
    });
  };
  const handleChange5 = (e: ChangeEvent<HTMLInputElement>, id:number ,campo: string) => {
      setHorariosData((prevData:any) => {
      const newData = prevData.data.map((item:any) => {
        if (item.idHorarios === id) {
          // Clona el objeto original y actualiza la propiedad especificada
          return {
            ...item,
            [campo]: e.target.value,
          };
        }
        return item;
        });

        return { data: newData };
      });
  };
  const handleChange6 = (e: ChangeEvent<HTMLSelectElement>, id: number, campo: string, diaId: number) => {
    setHorariosData((prevData: any) => {
      const newData = prevData.data.map((item:any) => {
        if (item.idHorarios === id) {
          // Clona el objeto original y actualiza la propiedad especificada
          const updatedDiasAtencion = item.diasAtencion?.map((dia:any) => {
            if (dia.idAtencion === diaId) {
              return {
                ...dia,
                [campo]: e.target.value,
              };
            }
            return dia;
          });

          return {
            ...item,
            diasAtencion: updatedDiasAtencion,
          };
        }
        return item;
      });

      return { data: newData };
    });
  };
 
  const clearData = () => {
    setModuloData(moduloBkData);
  };

  const editarModulo= async (id: number) => {
    if (
      moduloData.nombre !== moduloBkData.nombre ||
      serviceImg!=null

    ) {
      if (serviceImg != null) {
        moduloData.imagenUrl = await uploadFile(serviceImg, "servicios/");
      }

      const postModul={
        nombre:moduloData.nombre,
        imagenUrl:moduloData.imagenUrl
      }
      

      fetch(
        `${baseURL}/Servicios/updateServicio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postModul),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosModulo(id);
            setImg(null);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      } else {
      //warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
  };
const editarUbicacion = async (idMod: number) => {
    if (
      
      ubicacionData.descripcion !== ubicacionBkData.descripcion ||
      ubicacionImg!=null||
      ubicaionVideo!=null
    ) {
      if(ubicacionImg!=null){
        ubicacionData.imagen = await uploadFile(ubicacionImg,"ubicaciones/imagenes/");
      }
      if(ubicaionVideo!=null){
        ubicacionData.video = await uploadFile(ubicaionVideo,"ubicaciones/videos/");
      }
      if(ubicacionBkData.descripcion==null && ubicacionBkData.imagen==null && ubicacionBkData.video==null){
        const postUbi={
          descripcion:ubicacionData.descripcion,
          imagen:ubicacionData.imagen,
          video:ubicacionData.video,
          serviciosId:idMod,
          estado:true,
        }
        fetch(
        `${baseURL}/Ubicaciones/addUbicaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postUbi),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosUbicacion(idMod);
            setUImg(null);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al agregar nuevos datos"));
      }else{
        const postUbi={
          descripcion:ubicacionData.descripcion,
          imagen:ubicacionData.imagen,
          video:ubicacionData.video,
          serviciosId:idMod,
          estado:true,
        }
        fetch(
        `${baseURL}/Ubicaciones/updateUbicaciones/${ubicacionData.identificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postUbi),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosUbicacion(idMod);
            setUImg(null);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      }
      
    } else {
      //warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
  };
  const editarRequisitos = async (idMod: number) => {
    var count =0;
    requisitosData.data.forEach(req => {
      var aux1:any;
      var aux2:any;
      if(count>=requisitosBkData.data.length){
        aux1=null;
        aux2=null;
      }else{
        aux1=requisitosBkData.data[count].descripcion
        aux2=requisitosBkData.data[count].pasosRequisito[0].nombre
      }
      if (
        req.descripcion !== aux1 ||
        req.pasosRequisito[0].nombre !== aux2
      ) {
        if(req.identificador<=0){
          const postReq = {
              descripcion: req.descripcion,
              serviciosId:idMod,
              pasos: [
                {
                  nombre:req.pasosRequisito[0].nombre,
                }
              ]
              
        };
          fetch(
          `${baseURL}/Requisitos/addRequisito`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postReq),
          }
        )
          .then((response) => {
            if (response.ok) {
              successAlert("Éxito al editar los datos");
              cargarDatosRequisitos(idMod);
            } else {
              throw new Error("Error al cambiar los datos del servicio");
            }
          })
          .catch(() => errorAlert("Ocurrio un error al editar los datos"));
        }else{
          const postReq = {
              descripcion: req.descripcion,
              pasos: [
                {
                  id:req.pasosRequisito[0].identificador,
                  nombre:req.pasosRequisito[0].nombre,
                }
              ]
        };
        console.log(postReq)
          fetch(
          `${baseURL}/Requisitos/updateRequisito/${req.identificador}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postReq),
          }
        )
          .then((response) => {
            if (response.ok) {
              successAlert("Éxito al editar los datos");
              cargarDatosRequisitos(idMod);
            } else {
              throw new Error("Error al cambiar los datos del servicio");
            }
          })
          .catch(() => errorAlert("Ocurrio un error al editar los datos"));
        }
        
      } else {
       // warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
      }
      count++;
    });
    
  };
  const editarReferencias = async (idMod: number) => {
    var count =0;
    referenciaData.data.forEach(req => {
    var aux1:any;
    var aux2:any;
    if(count>=refereciaBkData.data.length){
      aux1=null;
      aux2=null;
    }else{
      aux1=refereciaBkData.data[count].nombre
      aux2=refereciaBkData.data[count].numero
    }
    if (
      req.nombre !== aux1 ||
      req.numero !== aux2
    ) {
      if(req.identificador<=0){
        const postRef = {
          nombre:req.nombre,
          numerocel:req.numero,
          serviciosId:idMod,
          estado: true
        };
        console.log(postRef)
        fetch(
        `${baseURL}/Referencia/addReferences`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postRef),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosReferencia(idMod);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      }else{
         const postRef = {
          nombre:req.nombre,
          numerocel:req.numero,
        };
        fetch(
        `${baseURL}/Referencia/updateReferences/${req.identificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postRef),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosReferencia(idMod);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      }
    } else {
      //warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
    count++;
  });
  };
   const editarHorarios = async (idMod: number) => {
    var count =0;
    horariosData.data.forEach(req => {
    var aux1:any;
    var aux2:any;
    var aux3:any;
    if(count>=horariosBkData.data.length){
      aux1=null;
      aux2=null;
    }else{
      aux1=horariosBkData.data[count].horaInicio
      aux2=horariosBkData.data[count].horaFin
      aux3=horariosBkData.data[count].diasAtencion[0].nombreDia
    }
    if (
      req.horaInicio !== aux1 ||
      req.horaFin !== aux2 ||
      req.diasAtencion[0].nombreDia!==aux3
    ) {
      if(req.idHorarios<=0){

        const postHor = {
            horaInicio: req.horaInicio,
            horaFin: req.horaFin,
            idServicio: numId,
            listAtencion:
            [
              {
                idDia:req.diasAtencion[0].nombreDia==="Lunes"?1
                :req.diasAtencion[0].nombreDia==="Martes"?2
                :req.diasAtencion[0].nombreDia==="Miercoles"?3
                :req.diasAtencion[0].nombreDia==="Jueves"?4
                :req.diasAtencion[0].nombreDia==="Viernes"?5
                :req.diasAtencion[0].nombreDia==="Sabado"?6
                :req.diasAtencion[0].nombreDia==="Domingo"?7
                :1
              }
            ]
        };
        console.log(postHor)
        fetch(
        `${baseURL}/Horarios/addHorario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postHor),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosHorario(idMod);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      }else{
         const postHor = {
            horaInicio: req.horaInicio,
            horaFin: req.horaFin,
            idServicio: numId,
            listAtencion:
            [
              {
                idDia:req.diasAtencion[0].nombreDia==="Lunes"?1
                :req.diasAtencion[0].nombreDia==="Martes"?2
                :req.diasAtencion[0].nombreDia==="Miercoles"?3
                :req.diasAtencion[0].nombreDia==="Jueves"?4
                :req.diasAtencion[0].nombreDia==="Viernes"?5
                :req.diasAtencion[0].nombreDia==="Sabado"?6
                :req.diasAtencion[0].nombreDia==="Domingo"?7
                :1
              }
            ]
        };
        fetch(
        `${baseURL}/Horarios/updateHorarios/${req.idHorarios}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postHor),
        }
      )
        .then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
            cargarDatosHorario(idMod);
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      }
    } else {
      //warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
    count++;
  });
  };
  const [inputsReq, setInputsReq]:any = useState([]);
  const [inputsRef, setInputsRef]:any = useState([]);
  const [inputsHor, setInputsHor]:any = useState([]);
  
  const handleAddRequisitos = () => {
    var newIdReq = requisitosData.data.length > 0 ? (requisitosData.data[requisitosData.data.length - 1].identificador) : -1;
    newIdReq=newIdReq>0?(newIdReq+1)*-1:(newIdReq-1);
    const newRequisito:IEditarRequisitosArray = {
      data:[
        {
        identificador: newIdReq,
          descripcion: "",
          pasosRequisito:
          [
              {
                identificador: countReq,
                nombre:""
              }  
          ]  
      }]

    };
    requisitosData.data.push(newRequisito.data[0]);
    countReq--;
    setInputsReq([...inputsReq]);
    console.log(requisitosData.data)
  }
  const handleDeleteRequisitos = (id:number) => {
    if(id<0){
      const indexAEliminar=requisitosData.data.findIndex((ex)=>ex.identificador===id);
      requisitosData.data.splice(indexAEliminar, 1);
      setInputsReq([...inputsReq]);
    }
  }

  const handleAddReferencias = () => {
    var newIdRef = referenciaData.data.length > 0 ? (referenciaData.data[referenciaData.data.length - 1].identificador) : -1;
    newIdRef=newIdRef>0?(newIdRef+1)*-1:(newIdRef-1);
    const newReference = {
      identificador: newIdRef,
      nombre: "", 
      numero: "", 
    };
    referenciaData.data.push(newReference);
    setInputsRef([...inputsRef]);
  }

  const handleDeleteReferencias = (id:number) => {
    if(id<0){
      const indexAEliminar=referenciaData.data.findIndex((ex)=>ex.identificador===id);
      referenciaData.data.splice(indexAEliminar,1);
      setInputsRef([...inputsRef]);
    }
    
  }
  const handleAddHorarios = () => {
    var newIdHorarios = horariosData.data.length > 0 ? (horariosData.data[horariosData.data.length - 1].idHorarios) : -1;
    newIdHorarios=newIdHorarios>0?(newIdHorarios+1)*-1:(newIdHorarios-1);
    const newHorario:IEditarHorarioArray = {
      data:
      [
        {
           idHorarios: newIdHorarios,
            horaInicio: "",
            horaFin: "",
            modulo: null,
            servicio: null,
            estado: true,
            diasAtencion:
            [
              {
                idAtencion:countHor,
                nombreDia:null
              }
            ]
        }
      ]   
    };
    horariosData.data.push(newHorario.data[0]);
    countHor--;
    setInputsHor([...inputsHor]);
    console.log(horariosData.data)
  }
  const handleDeleteHorarios = (id:number) => {

    if(id<0){
      const indexAEliminar=horariosData.data.findIndex((ex)=>ex.idHorarios===id);
      horariosData.data.splice(indexAEliminar,1);
      setInputsHor([...inputsHor]);
    }
    
  }
  return (
    <Layout>
      <PageTitle>Editar Servicio - Gabinete Psico-Pedagogico</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            value={moduloData.nombre}
            className="mt-1"
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>
        <hr className="my-4"/>
        <Label>
          <span className=" text-lg">Imagen de referencia para el Servicio</span>
          <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <span>Imagen Actual</span>
              <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={moduloBkData.imagenUrl === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : moduloBkData.imagenUrl}
                  alt="Imagen de Ubicación actual"
                />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span >Nueva Imagen</span>
              <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={serviceImg === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : URL.createObjectURL(serviceImg)}
                  alt="Imagen de Ubicación Nueva"
                />
              </div>
            </div>
          </div>
        </div>
         <Input
          type="file"
          className="mt-1"
          placeholder="Imagen del servicio"
          onChange={e => setImg(e.target.files?.[0] || null)}
        />
        </Label>
        <div className=" mt-4">
          <Button size="large" onClick={() => editarModulo(numId)}>
            Editar
          </Button>
        </div>
      </div>
      <SectionTitle>Requisitos</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          
          {
            requisitosData.data.map((req,index)=>(
              <div className="my-3" key={req.identificador}>
                <RequisitoInputs index={index} identificador={req.identificador} valueTitulo={req.descripcion} handle={handleChange2} hadleDelete={handleDeleteRequisitos} />
                {req.pasosRequisito.map((paso,index)=>(
                   <div className="my-3" key={paso.identificador}>
                  <RequisitoPasosInputs index={index} identificadorReq={req.identificador} identificador={paso.identificador} valueDescripcion={paso.nombre} handle={handleChange1}/>
                  </div>
                ))}
              </div>
            ))
          }
          
          {inputsReq}
        </Label>
        <div className="flex flex-row-reverse ...">
          <div >
            <Button  size="small" onClick={handleAddRequisitos}>
                +
            </Button>
          </div>
        </div>
        <div className="flex">
        <div className="mt-4">
          <Button size="large" onClick={()=>editarRequisitos(numId)}>
            Editar
          </Button>
        </div>
        <div className="mx-2 mt-4">
            <Modal pageRender={<EliminarRequisitos 
            title="Servicios"
            pathEnable={`Requisitos/getRequisitosByServiceId/${numId}`}
            pathDisable={`Requisitos/getDisabledRequisitosByServiceId/${numId}`}
              />} buttonName="Gestionar Requisitos"/>
          </div>
        </div>
        
      </div>
      <SectionTitle>Contactos de referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          
          {
            referenciaData.data.map((ref,index)=>(
               <div className="my-3" key={ref.identificador}>
                <ReferenciaInputs index={index} identificador={ref.identificador} valueNombre={ref.nombre} valueContacto={ref.numero} handle={handleChange3} hadleDelete={handleDeleteReferencias}/>
               </div>
            ))
          }
      
          {inputsRef}

        </Label>
        <div className="flex flex-row-reverse ...">
          <div >
            <Button  size="small" onClick={handleAddReferencias}>
                +
            </Button>
          </div>
        </div>
        <div className="flex">
          <div className=" mt-4">
            <Button size="large" onClick={() => editarReferencias(numId)}>
              Editar
            </Button>
          </div>
          <div className="mx-2 mt-4">
              <Modal pageRender={<EliminarReferencia 
              title="Servicios"
              pathEnable={`Referencia/getReferenciasbyServicioId/${numId}`}
              pathDisable={`Referencia/getDisabledReferenciasbyServicioId/${numId}`}
                />} buttonName="Gestionar Contactos"/>
            </div>
        </div>
      </div>
    <SectionTitle>Horarios de Atención</SectionTitle>
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <SectionTitle>Asignar un nuevo Horario</SectionTitle>
      <Label className="mt-4">
        {
          horariosData.data.map((ref,index)=>(
              <div className="my-3" key={index}>
              <HorariosInputs index={index} identificador={ref.idHorarios} valueDia={ref.diasAtencion[0].nombreDia} idAtencion={ref.diasAtencion[0].idAtencion}
               valueHorarioinicio={ref.horaInicio} valueHorarioFin={ref.horaFin} handle={handleChange5} handleSelect={handleChange6} hadleDelete={handleDeleteHorarios}/>
              </div>
          ))
        }
      {inputsHor}

      </Label>
      <div className="flex flex-row-reverse ...">
        <div >
          <Button  size="small" onClick={handleAddHorarios}>
              +
          </Button>
        </div>
      </div>
      <div className="flex">
        <div className="mx-2 mt-4">
        <Button size="large" onClick={() => editarHorarios(numId)}>
          Editar
        </Button>
        </div>
        <div className="mx-2 mt-4">
          <Modal pageRender={<EliminarHorario 
          title="Servicios"
          pathEnable={`Horarios/getHorariosbyServicioId/${numId}`}
          pathDisable={`Horarios/getDisabledHorariosbyServicioId/${numId}`}
            />} buttonName="Gestionar Horarios"/>
        </div>
      </div>
    </div>
    
    <SectionTitle>Ubicación</SectionTitle>
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <Label>
        <span >Descripción</span>
        <Input
          value={ubicacionData.descripcion === null ? "" : ubicacionData.descripcion}
          className="mt-1"
          placeholder="Ingrese la ubicación del servicio"
          onChange={(e) => handleChange4(e, "descripcion")}
        />
      </Label>
      <hr className="mt-4"/>
      <Label className="mt-4">
        <span className=" text-lg">Imagen de la ubicación del servicio</span>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <span>Imagen Actual</span>
              <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={ubicacionBkData.imagen === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : ubicacionBkData.imagen}
                  alt="Imagen de Ubicación actual"
                />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span >Nueva Imagen</span>
              <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={ubicacionImg === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png" : URL.createObjectURL(ubicacionImg)}
                  alt="Imagen de Ubicación Nueva"
                />
              </div>
            </div>
          </div>
        </div>
        <Input
          type="file"
          className="mt-1"
          placeholder="Imagen para ubicación"
          onChange={e => setUImg(e.target.files?.[0] || null)}
        />
      </Label>
      <hr className="mt-4"/>
      <Label className="mt-4">
        <span className=" text-lg">Video de la ubicación del servicio</span>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <span>Video Actual</span>
              <div className="w-96 h-48 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                <VideoPlayer
                  url={ubicacionData.video === null ? "" : ubicacionData.video}
                  width="384"
                  height="224"
                />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span>Nuevo Video</span>
              <div className="w-96 h-48 border-2 border-gray-500 rounded-lg overflow-hidden">
                <VideoPlayer
                  url={ubicacionData.video === null ? "" : ubicacionData.video}
                  width="384"
                  height="224"
                />
              </div>
            </div>
          </div>
        </div>
        <Input
          type="file"
          className="mt-1"
          placeholder="Video para ubicación"
          onChange={e => setUVideo(e.target.files?.[0] || null)}
        />
      </Label>

      <div className="mt-4">
        <Button size="large" onClick={() => editarUbicacion(numId)}>
          Editar
        </Button>
      </div>
    </div>

      <div className="flex flex-col flex-wrap mb-8 space-y-4 justify-around md:flex-row md:items-end md:space-x-4">
        <div>
          <Link href={{
            pathname: `/gabinetePsicoPedagogico/listarServicios`,
          }}>
          <Button size="large">Volver</Button>
          </Link>
        </div>

        <div>
          <Button size="large" onClick={clearData}>
            Limpiar campos
          </Button>
        </div>

        
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default EditarServicioPage;
