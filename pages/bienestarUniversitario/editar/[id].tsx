import React, { useState, ChangeEvent, useEffect, TextareaHTMLAttributes } from "react";
import { 
  IEditarServicio,
  IEditarUbicacion,
  IEditarReferenciaArray,
  IEditarRequisitosArray 
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
export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function EditarDatosGeneralesPage() {

  var countReq=-1;
  const [ubicacionImg,setUImg]:any = useState(null)
  const [ubicaionVideo,setUVideo]:any = useState(null)

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
  const router = useRouter();
  const { id } = router.query;
  const numId = parseInt(id as string, 10);
  
  async function cargarDatosModulo(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
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
        `http://apisistemaunivalle.somee.com/api/Ubicaciones/getUbicacionesbyServicioId/${id}`
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
        `http://apisistemaunivalle.somee.com/api/Requisitos/getRequisitosByServiceId/${id}`
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
        `http://apisistemaunivalle.somee.com/api/Referencia/getReferenciasbyServicioId/${id}`
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

  useEffect(() => {
    cargarDatosModulo(numId);
    cargarDatosUbicacion(numId);
    cargarDatosRequisitos(numId);
    cargarDatosReferencia(numId);
  }, []);

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
  
  const clearData = () => {
    setModuloData(moduloBkData);
  };

  const editarModulo= async (id: number) => {
    if (
      moduloData.nombre !== moduloBkData.nombre 

    ) {
      const postModul={
        nombre:moduloData.nombre,
        imagenUrl:moduloData.imagenUrl
      }
      console.log(postModul)
      fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/updateServicio/${id}`,
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
          id_modulo:idMod,
          estado:true,
        }
        fetch(
        `http://apisistemaunivalle.somee.com/api/Ubicaciones/addUbicaciones`,
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
          id_modulo:idMod,
          estado:true,
        }
        console.log(postUbi)
        fetch(
        `http://apisistemaunivalle.somee.com/api/Ubicaciones/updateUbicaciones/${ubicacionData.identificador}`,
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
          `http://apisistemaunivalle.somee.com/api/Requisitos/addRequisito`,
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
          `http://apisistemaunivalle.somee.com/api/Requisitos/updateRequisito/${req.identificador}`,
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
        `http://apisistemaunivalle.somee.com/api/Referencia/addReferences`,
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
        `http://apisistemaunivalle.somee.com/api/Referencia/updateReferences/${req.identificador}`,
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
  const [inputPaso, setInputsPaso]:any = useState([]);
  const [inputsRef, setInputsRef]:any = useState([]);

  const handleAddRequisitos = () => {
    
    const newRequisito:IEditarRequisitosArray = {
      data:[
        {
        identificador:(requisitosData.data.length+1) * -1,
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
      requisitosData.data.pop();
      setInputsReq([...inputsReq]);
      console.log(requisitosData.data)
    }
    
  }
  const handleAddReferencias = () => {
    const newReference = {
      identificador: (referenciaData.data.length+1) * -1,
      nombre: "", 
      numero: "", 
    };
    referenciaData.data.push(newReference);
    setInputsRef([...inputsRef]);
    console.log(referenciaData.data)
  }
  const handleDeleteReferencias = (id:number) => {
    if(id<0){
      referenciaData.data.pop();
      setInputsRef([...inputsRef]);
      console.log(referenciaData.data)
    }
    
  }
  return (
    <Layout>
      <PageTitle>Editar Servicio - Bienestar Universitario</PageTitle>
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
        <div className="mt-4">
         
          <Button size="large" onClick={()=>editarRequisitos(numId)}>
            Editar
          </Button>
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
        <div className=" mt-4">
          <Button size="large" onClick={() => editarReferencias(numId)}>
            Editar
          </Button>
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
                  src={ubicacionBkData.imagen === null ? "" : ubicacionBkData.imagen}
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
              <div className="w-96 h-56 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                <VideoPlayer
                  url={ubicacionData.video === null ? "" : ubicacionData.video}
                  width="384"
                  height="224"
                />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span>Nuevo Video</span>
              <div className="w-96 h-56 border-2 border-gray-500 rounded-lg overflow-hidden">
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
          <Button size="large">Volver</Button>
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

export default EditarDatosGeneralesPage;
