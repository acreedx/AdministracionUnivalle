import React, { useState, ChangeEvent, useEffect } from "react";
import { 
  IEditarModulo,
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

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function EditarDatosGeneralesPage() {
  const [serviceImg,setImg]:any = useState(null)
  const [ubicacionImg,setUImg]:any = useState(null)
  const [ubicaionVideo,setUVideo]:any = useState(null)

  const [moduloData, setModuloData] = useState<IEditarModulo>({
    nombremodulo: "",
  });
  const [moduloBkData, setModuloBkData] = useState<IEditarModulo>({
    nombremodulo: "",
  });
  const [ubicacionData, setUbicacionData] = useState<IEditarUbicacion>({
    descripcion: null,
    imagen: null,
    video:null,
  });
  const [ubicacionBkData, setUbicacionBkData] = useState<IEditarUbicacion>({
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
        [ {
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
        [ {
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
        `http://apisistemaunivalle.somee.com/api/Modulos/getModuloById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData = await res.json();
      setModuloBkData({
        nombremodulo: resData.data.nombremodulo,
      });
      setModuloData({
        nombremodulo: resData.data.nombremodulo,
      });
      
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }
async function cargarDatosUbicacion(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setUbicacionBkData({
        descripcion: resData.data.descripcion,
        imagen: resData.data.imagen,
        video:resData.data.video,
      });
      setUbicacionData({
        descripcion: resData.data.descripcion,
        imagen: resData.data.imagen,
        video:resData.data.video,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosRequisitos(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Requisitos/getRequisitosByServiceId/1`
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
      errorAlert("Ocurrió un error al traer los datos");
    }
    
  }
  async function cargarDatosReferencia(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Referencia/getReferenciasbyModuloId/${id}`
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
      errorAlert("Ocurrió un error al traer los datos");
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
  const handleChange1 = (e: ChangeEvent<HTMLTextAreaElement>,id:number ,campo: string) => {
      // Encuentra el requisito en el arreglo por su identificador (id)
      requisitosData.data.map(req=>{
          if(id==req.identificador){
            req.descripcion+=e.target.value;
            console.log(req);
          }
        }
      )

      
      // setRequisitosData({
      //   ...requisitosData.data,
      //   [campo]: e.target.value,
      // });
      
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

  const editarServicio = async (id: number) => {
    if (
      moduloData.nombremodulo !== moduloData.nombremodulo
    ) {
      fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/updateServicio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moduloData),
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
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
  };
const editarUbicacion = async (id: number) => {
    if (
      ubicacionData.descripcion !== ubicacionData.descripcion || 
      ubicacionData.imagen !== ubicacionData.imagen || 
      ubicacionData.video !== ubicacionData.video
    ) {
      if(ubicacionImg!=null){
        ubicacionData.imagen = await uploadFile(ubicacionImg,"ubicaciones/imagenes/");
      }
      if(ubicaionVideo!=null){
        ubicacionData.video = await uploadFile(ubicaionVideo,"ubicaciones/videos/");
      }
      if(ubicacionBkData.descripcion==null && ubicacionBkData.imagen==null && ubicacionBkData.video==null){
        fetch(
        `http://apisistemaunivalle.somee.com/api/Ubicaciones/addUbicacion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moduloData),
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
        fetch(
        `http://apisistemaunivalle.somee.com/api/Ubicaciones/updateUbicacion/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moduloData),
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
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
  };
  const editarRequisitos = async (id: number) => {
    requisitosData.data.forEach(req => {
      if (
        req.descripcion !== req.descripcion
      ) {
        if(req.descripcion==null){
          fetch(
          `http://apisistemaunivalle.somee.com/api/Requisitos/addRequisisto`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req.descripcion),
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
          fetch(
          `http://apisistemaunivalle.somee.com/api/Requisitos/updatRequisito/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(moduloData),
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
        warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
      }
    });
    
  };
  const editarReferencias = async (idMod: number) => {
    var count =0;
    referenciaData.data.forEach(req => {
    if (
      req.nombre !== refereciaBkData.data[count].nombre ||
      req.numero !== refereciaBkData.data[count].numero
    ) {
      if(req.identificador<=0){
        const postRef = {
          nombre:req.nombre,
          numerocel:req.numero,
          serviciosId:null,
          id_modulo:idMod
        };
        console.log(postRef)
        fetch(
        `http://apisistemaunivalle.somee.com/api/Referencias/addReferencia/`,
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
        fetch(
        `http://apisistemaunivalle.somee.com/api/Referencias/updateReferencia/${req.identificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
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
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
    count++;
  });
  };
  const [addRequisitos, setAddRequisitos] = useState(false);
  const [inputsReq, setInputsReq]:any = useState([]);
  const [inputsRef, setInputsRef]:any = useState([]);

  const handleAddRequisitos = () => {
    setAddRequisitos(true);
    setInputsReq([...inputsReq, <Textarea 
                  key={inputsReq.length}
                  rows={3} 
                  placeholder="Ingresa los requisitos del servicio." 
                  onChange={(e) => handleChange1(e, 0 ,"descripcion")}
                />]);
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
      <PageTitle>Editar Pagina Principal - Gabinete Psico-Pedagogico</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del modulo</span>
          <Input
            value={moduloData.nombremodulo}
            className="mt-1"
            placeholder="Escriba aquí el nombre del modulo"
            onChange={(e) => handleChange(e, "nombremodulo")}
          />
        </Label>
        <div className=" mt-4">
          <Button size="large" onClick={() => editarServicio(numId)}>
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
                 <div className=" text-lg">Requisito {index+1}</div>
                <span>Descripción</span>
                 <Textarea 
                  value={req.descripcion === null ? "" : req.descripcion}
                  rows={3} 
                  placeholder="Ingresa los requisitos del servicio." 
                  onChange={(e) => handleChange1(e, req.identificador,"descripcion")}
                />
                <hr className=" mt-3"/>
              </div>
            ))
          }
          
          {addRequisitos && inputsReq}
        </Label>
        <div className="flex flex-row-reverse ...">
          <div >
            <Button  size="small" onClick={handleAddRequisitos}>
                +
            </Button>
          </div>
        </div>
        <div className="mt-4">
         
          <Button size="large" >
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
          <span>Ubicación</span>
          <Input
            value={ubicacionData.descripcion === null ? "" : ubicacionData.descripcion}
            className="mt-1"
            placeholder="Ingrese la ubicación del servicio"
            onChange={(e) => handleChange4(e, "descripcion")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de la ubicación del servicio</span>
          <Input
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            onChange={e => setUImg(e.target.files?.[0] || null)}
          />
        </Label>
        <Label className="mt-4">
          <span>Video de la ubicación del servicio</span>
          <Input
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            onChange={e => setUVideo(e.target.files?.[0] || null)}
          />
        </Label>
         <div className=" mt-4">
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
