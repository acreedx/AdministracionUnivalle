import React, { useState, ChangeEvent, useEffect } from "react";
import { 
  IEditarServicio,
  IEditarUbicacion,
  IEditarReferencia,
  IEditarCarrera,
  IEditarRequisitos } from "../../../utils/interfaces/servicios";
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

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function EditarPaginaPrincipalPage() {
  const [serviceImg,setImg]:any = useState(null)
  const [ubicacionImg,setUImg]:any = useState(null)
  const [ubicaionVideo,setUVideo]:any = useState(null)
  const [servicioData, setServicioData] = useState<IEditarServicio>({
    nombre: "",
    imagenUrl: null,
  });
  const [servicioBkData, setServicioBkData] = useState<IEditarServicio>({
    nombre: "",
    imagenUrl: null,
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
  const [requisitosData, setRequisitosData] = useState<IEditarRequisitos>({
    descripcion: null,
  });
  const [requisitosBkData, setRequisitosBkData] = useState<IEditarRequisitos>({
    descripcion: null,
  });
  const [referenciaData, setReferenciaData] = useState<IEditarReferencia>({
    nombre: null,
    numeroCel: null,
  });
  const [refereciaBkData, setReferenciaBkData] = useState<IEditarReferencia>({
    nombre: null,
    numeroCel: null,
  });
  const [carreraData, setCarreraData] = useState<IEditarCarrera>({
    nombre: null,
  });
  const [carreraBkData, setCarreraBkData] = useState<IEditarCarrera>({
    nombre: null,
  });
  const router = useRouter();
  const { id } = router.query;
  const numId = parseInt(id as string, 10);

  async function cargarDatosServicio(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setServicioBkData({
        nombre: resData.data.nombre,
        imagenUrl: resData.data.imagenUrl,
      });
      setServicioData({
        nombre: resData.data.nombre,
        imagenUrl: resData.data.imagenUrl,
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
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setRequisitosBkData({
        descripcion: resData.data.descripcion,
      });
      setRequisitosData({
        descripcion: resData.data.descripcion,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosReferencia(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setReferenciaBkData({
        nombre: resData.data.nombre,
        numeroCel:resData.data.numeroCel,
      });
      setReferenciaData({
        nombre: resData.data.nombre,
        numeroCel:resData.data.numeroCel,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosCarrera(id: number) {
    try {
      const res = await fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/getServicioById/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setCarreraBkData({
        nombre: resData.data.nombre,
      });
      setCarreraData({
        nombre: resData.data.nombre,
      });
    } catch (error) {
      errorAlert("Ocurrió un error al traer los datos");
    }
  }
  useEffect(() => {
    cargarDatosServicio(numId);
    cargarDatosUbicacion(numId);
    cargarDatosRequisitos(numId);
    cargarDatosReferencia(numId);
    cargarDatosCarrera(numId);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setServicioData({
      ...servicioData,
      [campo]: e.target.value,
    });
  };
  const handleChange1 = (e: ChangeEvent<HTMLTextAreaElement>, campo: string) => {
      setRequisitosData({
        ...requisitosData,
        [campo]: e.target.value,
      });
    };
  const handleChange2 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setCarreraData({
      ...carreraData,
      [campo]: e.target.value,
    });
  };
  const handleChange3 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setReferenciaData({
      ...referenciaData,
      [campo]: e.target.value,
    });
  };
  const handleChange4 = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    setUbicacionData({
      ...ubicacionData,
      [campo]: e.target.value,
    });
  };
  const clearData = () => {
    setServicioData(servicioBkData);
  };

  const editarServicio = async (id: number) => {
    if (
      servicioData.nombre !== servicioBkData.nombre ||
      servicioData.imagenUrl !== servicioBkData.imagenUrl
    ) {
      if(serviceImg!=null){
        servicioData.imagenUrl = await uploadFile(serviceImg,"servicios/");
      }
      fetch(
        `http://apisistemaunivalle.somee.com/api/Servicios/updateServicio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
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
          body: JSON.stringify(servicioData),
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
          body: JSON.stringify(servicioData),
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
  const editarCarrera = async (id: number) => {
    if (
      carreraData.nombre !== carreraData.nombre
    ) {
      if(carreraBkData.nombre==null){
        fetch(
        `http://apisistemaunivalle.somee.com/api/Carreras/addCarrera`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
        }
      ).then((response) => {
          if (response.ok) {
            successAlert("Éxito al editar los datos");
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() => errorAlert("Ocurrio un error al editar los datos"));
      }else{
         fetch(
        `http://apisistemaunivalle.somee.com/api/Carreras/updateCarrera/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
        }
      ).then((response) => {
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
    if (
      requisitosData.descripcion !== requisitosData.descripcion
    ) {
      if(requisitosBkData.descripcion==null){
        fetch(
        `http://apisistemaunivalle.somee.com/api/Requisitos/addRequisisto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
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
          body: JSON.stringify(servicioData),
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

  const editarReferencias = async (id: number) => {
    if (
      referenciaData.nombre !== referenciaData.nombre ||
      referenciaData.numeroCel !== referenciaData.numeroCel
    ) {
      if(refereciaBkData.nombre==null && refereciaBkData.numeroCel==null){
        fetch(
        `http://apisistemaunivalle.somee.com/api/Referencias/addReferencia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
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
        `http://apisistemaunivalle.somee.com/api/Referencias/updateReferencia/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicioData),
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
  return (
    <Layout>
      <PageTitle>Editar Pagina Principal - Consultorio Odontologico</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del servicio</span>
          <Input
            value={servicioData.nombre}
            className="mt-1"
            placeholder="Escriba aquí el nombre del servicio"
            onChange={(e) => handleChange(e, "nombre")}
          />
        </Label>

        <Label className="mt-4">
          <span>Imagen de referencia para el servicio</span>
          <Input
            type="file"
            className="mt-1"
            placeholder="Imagen para el servicio"
            onChange={e => setImg(e.target.files?.[0] || null)}
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
          <span>Descripción</span>
          <Textarea 
            value={requisitosData.descripcion === null ? "" : requisitosData.descripcion}
            className="mt-1" 
            rows={3} 
            placeholder="Ingresa los requisitos del servicio." 
            onChange={(e) => handleChange1(e, "descripcion")}
          />
        </Label>
        <div className=" mt-4">
          <Button size="large" onClick={() => editarRequisitos(numId)}>
            Editar
          </Button>
        </div>
      </div>
      <SectionTitle>Contactos de referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          <span>Nombre del Contacto</span>
           <Input
            value={referenciaData.nombre === null ? "" : referenciaData.nombre}
            className="mt-1"
            placeholder="Escriba el nombre del contacto."
            onChange={(e) => handleChange3(e, "nombre")}
          />
        </Label>
         <Label className="mt-4">
          <span>Número del Contacto</span>
           <Input
            value={referenciaData.numeroCel === null ? "" : referenciaData.numeroCel}
            className="mt-1"
            placeholder="Escriba el numero del contacto."
            onChange={(e) => handleChange3(e, "numeroCel")}
          />
        </Label>
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

export default EditarPaginaPrincipalPage;
