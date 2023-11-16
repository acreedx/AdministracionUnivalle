import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import {
  IEditarModulo,
  IEditarUbicacion,
  IEditarReferenciaArray,
  IEditarRequisitosArray,
} from "../../../utils/interfaces/servicios";
import { HelperText, Input, Label } from "@roketid/windmill-react-ui";
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
import { uploadFile } from "../../../firebase/config";
import ReferenciaInputs from "../../../components/referenciasInput";
import RequisitoInputs from "../../../components/requisitosInput";
import RequisitoPasosInputs from "../../../components/requisitoPasosInput";
import VideoPlayer from "components/video_player";
import Modal from "../../../components/modal";
import EliminarReferencia from "../eliminarDatos/referenciaDel";
import EliminarRequisitos from "../eliminarDatos/requisitosDel";
import {
  checkValidationEdit,
  onlyLetters,
  onlyLettersAndNumbers,
  resetDefaultValFlags,
  validateImg,
  validateUbicationString,
  validateVideo,
} from "utils/functions/validations";
import { IListarModulos } from "utils/interfaces/usuarios";

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

function EditarDatosGeneralesPage() {
  var countReq = -1;
  const [ubicacionImg, setUImg]: any = useState(null);
  const [ubicaionVideo, setUVideo]: any = useState(null);

  const [moduloData, setModuloData] = useState<IEditarModulo>({
    nombremodulo: "",
  });
  const [moduloBkData, setModuloBkData] = useState<IEditarModulo>({
    nombremodulo: "",
  });
  const [ubicacionData, setUbicacionData] = useState<IEditarUbicacion>({
    identificador: 0,
    descripcion: null,
    imagen: null,
    video: null,
  });
  const [ubicacionBkData, setUbicacionBkData] = useState<IEditarUbicacion>({
    identificador: 0,
    descripcion: null,
    imagen: null,
    video: null,
  });
  const [requisitosData, setRequisitosData] = useState<IEditarRequisitosArray>({
    data: [
      {
        identificador: 0,
        descripcion: null,
        pasosRequisito: [
          {
            identificador: 0,
            nombre: null,
          },
        ],
      },
    ],
  });
  const [requisitosBkData, setRequisitosBkData] =
    useState<IEditarRequisitosArray>({
      data: [
        {
          identificador: 0,
          descripcion: null,
          pasosRequisito: [
            {
              identificador: 0,
              nombre: null,
            },
          ],
        },
      ],
    });
  const [referenciaData, setReferenciaData] = useState<IEditarReferenciaArray>({
    data: [
      {
        identificador: 0,
        nombre: null,
        numero: null,
      },
    ],
  });
  const [refereciaBkData, setReferenciaBkData] =
    useState<IEditarReferenciaArray>({
      data: [
        {
          identificador: 0,
          nombre: null,
          numero: null,
        },
      ],
    });

  const [modules, setModules] = useState<IListarModulos[]>([]);

  const router = useRouter();
  const { id } = router.query;
  const numId = parseInt(id as string, 10);

  //Errors variables

  const [flagsNombreModulo, setFlagsNombreModulo] = useState({
    nombreModulo: undefined,
    imagen: undefined,
  });
  const [textErrorsNombreModule, setTextErrorsNombreModule] = useState({
    nombreModulo: "",
    imagen: "",
  });

  const [flagsRequisitos, setFlagsRequisitos] = useState([
    {
      nombreModulo: undefined,
      imagen: undefined,
    },
  ]);
  const [textErrorsRequisitos, setTextErrorsRequisitos] = useState([
    {
      nombreModulo: "",
      imagen: "",
    },
  ]);

  const [flagsReferencia, setFlagsReferencia] = useState<Array<any>>([]);
  const [textErrorsReferencia, setTextErrorsReferencia] = useState<any>([]);

  const [flagsUbicacion, setFlagsUbicacion] = useState({
    descripcion: undefined,
    imagen: undefined,
    video: undefined,
  });
  const [textErrorsUbicacion, setTextErrorsUbicacion] = useState({
    descripcion: "",
    imagen: "",
    video: "",
  });

  const inputFileImgUbi: any = useRef(null);
  const inputFileVideoUbi: any = useRef(null);

  async function cargarModulos() {
    try {
      const res = await fetch(
        "https://apisistemaunivalle.somee.com/api/Modulos/getActiveModulos"
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del modulo.");
      }
      const resData = await res.json();
      setModules(resData.data);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }

  async function cargarDatosModulo(id: number) {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Modulos/getModuloById/${id}`
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
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosUbicacion(id: number) {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Ubicaciones/getUbicacionesbyModuloId/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos de la ubicación.");
      }
      const resData = await res.json();

      setUbicacionBkData({
        identificador: resData.data[0].identificador,
        descripcion: resData.data[0].descripcion,
        imagen: resData.data[0].imagen,
        video: resData.data[0].video,
      });
      setUbicacionData({
        identificador: resData.data[0].identificador,
        descripcion: resData.data[0].descripcion,
        imagen: resData.data[0].imagen,
        video: resData.data[0].video,
      });
      console.log(ubicacionData);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }
  async function cargarDatosRequisitos(id: number) {
    try {
      const res = await fetch(
        `https://apisistemaunivalle.somee.com/api/Requisitos/getRequisitosByModuloId/${id}`
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
        `https://apisistemaunivalle.somee.com/api/Referencia/getReferenciasbyModuloId/${id}`
      );
      if (!res.ok) {
        throw new Error("Error al obtener los datos del servicio.");
      }
      const resData = await res.json();

      setReferenciaBkData({
        data: resData.data,
      });
      setReferenciaData({
        data: resData.data,
      });

      const newFlags = Array.from({ length: resData.data.length }, () => ({
        nombre: undefined,
        numero: undefined,
      }));

      const newTexts = Array.from({ length: resData.data.length }, () => ({
        nombre: "",
        numero: "",
      }));

      setFlagsReferencia(newFlags);
      setTextErrorsReferencia(newTexts);
    } catch (error) {
      //errorAlert("Ocurrió un error al traer los datos");
    }
  }

  useEffect(() => {
    cargarDatosModulo(numId);
    cargarDatosUbicacion(numId);
    cargarDatosRequisitos(numId);
    cargarDatosReferencia(numId);
    cargarModulos();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    const value = e.target.value;
    const emptyStringValue = value.match(/^(\s*)(.*)(\s*)$/);
    let valid: any = true;
    let validText = "";
    if (value === moduloBkData.nombremodulo) {
      valid = undefined;
    } else if (
      !onlyLettersAndNumbers(value) ||
      value.length >= 50 ||
      (emptyStringValue || [])[1].length > 0 ||
      value.length === 0
    ) {
      valid = false;
    }

    if (!onlyLettersAndNumbers(value)) {
      validText = "El nombre solo debe contener números y letras";
    } else if (value.length >= 50) {
      validText = "El nombre solo puede tener 50 caracteres como máximo";
    } else if ((emptyStringValue || [])[1].length > 0) {
      validText = "El nombre no puede tener espacios al inicio";
    } else if (value.length === 0) {
      validText = "No se puede ingresar un nombre vacío";
    } else {
      validText = "Nombre ingresado válido";
    }

    setFlagsNombreModulo((prev) => ({ ...prev, nombreModulo: valid }));
    setTextErrorsNombreModule((prev) => ({ ...prev, nombreModulo: validText }));

    setModuloData({
      ...moduloData,
      [campo]: e.target.value,
    });
  };
  const handleChange1 = (
    e: ChangeEvent<HTMLTextAreaElement>,
    id: number,
    pasoId: number,
    campo: string
  ) => {
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
  const handleChange2 = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    campo: string
  ) => {
    setRequisitosData((prevData: any) => {
      const newData = prevData.data.map((item: any) => {
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
  const handleChange3 = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    campo: string
  ) => {
    const reference = referenciaData.data.find(
      (r: any) => r.identificador === id
    );

    const referenceBk = refereciaBkData.data.find(
      (r: any) => r.identificador === id
    );

    const value = e.target.value;
    const emptyStringValue = value.match(/^(\s*)(.*)(\s*)$/);
    let valid: any = true;
    let validText = "";
    if (referenceBk && value === referenceBk.nombre) {
      valid = undefined;
    } else if (
      !onlyLetters(value) ||
      value.length >= 50 ||
      (emptyStringValue || [])[1].length > 0 ||
      value.length === 0
    ) {
      valid = false;
    }

    if (!onlyLetters(value)) {
      validText = "El nombre solo debe contener números y letras";
    } else if (value.length >= 50) {
      validText = "El nombre solo puede tener 50 caracteres como máximo";
    } else if ((emptyStringValue || [])[1].length > 0) {
      validText = "El nombre no puede tener espacios al inicio";
    } else if (value.length === 0) {
      validText = "No se puede ingresar un nombre vacío";
    } else {
      validText = "Nombre ingresado válido";
    }

    setFlagsReferencia((prev: any) => {
      const updatedFlags = [...prev];
      const indexToUpdate = referenciaData.data.findIndex(
        (ref) => ref.identificador === id
      );

      if (indexToUpdate !== -1) {
        updatedFlags[indexToUpdate] = {
          ...updatedFlags[indexToUpdate],
          nombre: valid,
        };
      }

      return updatedFlags;
    });
    setTextErrorsReferencia((prev: any) => {
      const updatedFlags = [...prev];
      const indexToUpdate = referenciaData.data.findIndex(
        (ref) => ref.identificador === id
      );

      if (indexToUpdate !== -1) {
        updatedFlags[indexToUpdate] = {
          ...updatedFlags[indexToUpdate],
          nombre: validText.toString(),
        };
      }

      return updatedFlags;
    });

    setReferenciaData((prevData: any) => {
      const newData = prevData.data.map((item: any) => {
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
    const value = e.target.value;
    const emptyStringValue = value.match(/^(\s*)(.*)(\s*)$/);
    let valid: any = true;
    let validText = "";
    if (value === ubicacionBkData.descripcion) {
      valid = undefined;
    } else if (
      !validateUbicationString(value) ||
      value.length >= 250 ||
      (emptyStringValue || [])[1].length > 0 ||
      value.length === 0
    ) {
      valid = false;
    }

    if (!validateUbicationString(value)) {
      validText =
        'La descripción solo debe contener números, letras y el caracter "-"';
    } else if (value.length >= 250) {
      validText = "La descripción solo puede tener 250 caracteres como máximo";
    } else if ((emptyStringValue || [])[1].length > 0) {
      validText = "La descripción no puede tener espacios al inicio";
    } else if (value.length === 0) {
      validText = "No se puede ingresar una descripción vacía";
    } else {
      validText = "Descripción ingresada válida";
    }

    setFlagsUbicacion((prev) => ({ ...prev, descripcion: valid }));
    setTextErrorsUbicacion((prev) => ({ ...prev, descripcion: validText }));

    setUbicacionData({
      ...ubicacionData,
      [campo]: e.target.value,
    });
  };

  const clearData = () => {
    setModuloData(moduloBkData);
    clearValidations();
  };

  const clearValidations = () => {
    clearValidationsMod();
    clearValidationsUbi();
  };

  const clearValidationsMod = () => {
    setFlagsNombreModulo(resetDefaultValFlags(flagsNombreModulo, undefined));
    setTextErrorsNombreModule(resetDefaultValFlags(textErrorsNombreModule, ""));
  };

  const clearValidationsUbi = () => {
    setFlagsUbicacion(resetDefaultValFlags(flagsUbicacion, undefined));
    setTextErrorsUbicacion(resetDefaultValFlags(textErrorsUbicacion, ""));
  };

  const editarModulo = async (id: number) => {
    const check = checkValidationEdit(flagsNombreModulo);
    const repetitiveModule = modules.find(
      (m: any) =>
        m.nombre === moduloData.nombremodulo &&
        m.nombre != moduloBkData.nombremodulo
    );
    const validation = check === 0 || check === 2 || repetitiveModule;
    let send = validation ? false : true;

    if (validation) {
      warningAlert(
        check === 0
          ? "No cambio ningún dato, por lo que no se hizo la edición"
          : check === 2
          ? "Si desea editar, ingrese valores válidos"
          : repetitiveModule
          ? "Nombre del módulo ya existe"
          : "Valor no válido ingresado"
      );
    }

    if (send) {
      const postModul = {
        nombremodulo: moduloData.nombremodulo,
      };
      fetch(
        `https://apisistemaunivalle.somee.com/api/Modulos/updateModulo/${id}`,
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
            cargarModulos();
            clearValidationsMod();
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
    let send = true;
    const check = checkValidationEdit(flagsUbicacion);
    if (check === 0) {
      send = false;
      warningAlert("No cambio ningún dato, por lo que no se hizo la edición");
    }
    if (check === 2) {
      send = false;
      warningAlert("Si desea editar, ingrese valores válidos");
    }

    if (send) {
      if (ubicacionImg != null && flagsUbicacion.imagen) {
        ubicacionData.imagen = await uploadFile(
          ubicacionImg,
          "ubicaciones/imagenes/"
        );
      }
      if (ubicaionVideo != null && flagsUbicacion.video) {
        ubicacionData.video = await uploadFile(
          ubicaionVideo,
          "ubicaciones/videos/"
        );
      }
      const postUbi = {
        descripcion: ubicacionData.descripcion,
        imagen: ubicacionData.imagen,
        video: ubicacionData.video,
        id_modulo: idMod,
        estado: true,
      };

      const postOrPut =
        ubicacionBkData.descripcion == null &&
        ubicacionBkData.imagen == null &&
        ubicacionBkData.video == null;

      fetch(
        postOrPut
          ? `https://apisistemaunivalle.somee.com/api/Ubicaciones/addUbicaciones`
          : `https://apisistemaunivalle.somee.com/api/Ubicaciones/updateUbicaciones/${ubicacionData.identificador}`,
        {
          method: postOrPut ? "POST" : "PUT",
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
            clearImg();
            clearVideo();
            clearValidationsUbi();
          } else {
            throw new Error("Error al cambiar los datos del servicio");
          }
        })
        .catch(() =>
          errorAlert(
            postOrPut
              ? "Ocurrio un error al agregar nuevos datos"
              : "Ocurrio un error al editar los datos"
          )
        );
    }
  };
  const editarRequisitos = async (idMod: number) => {
    var count = 0;
    requisitosData.data.forEach((req) => {
      var aux1: any;
      var aux2: any;
      if (count >= requisitosBkData.data.length) {
        aux1 = null;
        aux2 = null;
      } else {
        aux1 = requisitosBkData.data[count].descripcion;
        aux2 = requisitosBkData.data[count].pasosRequisito[0].nombre;
      }
      if (req.descripcion !== aux1 || req.pasosRequisito[0].nombre !== aux2) {
        if (req.identificador <= 0) {
          const postReq = {
            descripcion: req.descripcion,
            id_modulo: idMod,
            pasos: [
              {
                nombre: req.pasosRequisito[0].nombre,
              },
            ],
          };
          fetch(
            `https://apisistemaunivalle.somee.com/api/Requisitos/addRequisito`,
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
        } else {
          const postReq = {
            descripcion: req.descripcion,
            pasos: [
              {
                id: req.pasosRequisito[0].identificador,
                nombre: req.pasosRequisito[0].nombre,
              },
            ],
          };
          console.log(postReq);
          fetch(
            `https://apisistemaunivalle.somee.com/api/Requisitos/updateRequisito/${req.identificador}`,
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
    var count = 0;
    referenciaData.data.forEach((req) => {
      var aux1: any;
      var aux2: any;
      if (count >= refereciaBkData.data.length) {
        aux1 = null;
        aux2 = null;
      } else {
        aux1 = refereciaBkData.data[count].nombre;
        aux2 = refereciaBkData.data[count].numero;
      }
      if (req.nombre !== aux1 || req.numero !== aux2) {
        if (req.identificador <= 0) {
          const postRef = {
            nombre: req.nombre,
            numerocel: req.numero,
            id_modulo: idMod,
            estado: true,
          };
          console.log(postRef);
          fetch(
            `https://apisistemaunivalle.somee.com/api/Referencia/addReferences`,
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
        } else {
          const postRef = {
            nombre: req.nombre,
            numerocel: req.numero,
          };
          fetch(
            `https://apisistemaunivalle.somee.com/api/Referencia/updateReferences/${req.identificador}`,
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

  const [inputsReq, setInputsReq]: any = useState([]);
  const [inputPaso, setInputsPaso]: any = useState([]);
  const [inputsRef, setInputsRef]: any = useState([]);

  const handleAddRequisitos = () => {
    const newRequisito: IEditarRequisitosArray = {
      data: [
        {
          identificador: (requisitosData.data.length + 1) * -1,
          descripcion: "",
          pasosRequisito: [
            {
              identificador: countReq,
              nombre: "",
            },
          ],
        },
      ],
    };
    requisitosData.data.push(newRequisito.data[0]);
    countReq--;
    setInputsReq([...inputsReq]);
    console.log(requisitosData.data);
  };
  const handleDeleteRequisitos = (id: number) => {
    if (id < 0) {
      const indexAEliminar = requisitosData.data.findIndex(
        (ex) => ex.identificador === id
      );
      requisitosData.data.splice(indexAEliminar, 1);
      setInputsReq([...inputsReq]);
    }
  };
  const handleAddReferencias = () => {
    const newReference = {
      identificador: (referenciaData.data.length + 1) * -1,
      nombre: "",
      numero: "",
    };
    referenciaData.data.push(newReference);
    setInputsRef([...inputsRef]);
    console.log(referenciaData.data);
  };
  const handleDeleteReferencias = (id: number) => {
    if (id < 0) {
      const indexAEliminar = referenciaData.data.findIndex(
        (ex) => ex.identificador === id
      );
      referenciaData.data.splice(indexAEliminar, 1);
      setInputsRef([...inputsRef]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];

    let valid: any = true;
    let validText = "";

    let imgRes = validateImg(value);

    if (imgRes == 0) {
      valid = undefined;
    } else if (imgRes === 2 || imgRes === 3) {
      valid = false;
    }

    if (imgRes == 1) {
      setUImg(value);
    } else {
      clearImg();
    }

    validText =
      imgRes === 1
        ? "Imagen válida"
        : imgRes === 2
        ? "Solo se permite imágenes con tamaño menor a 10MB"
        : imgRes === 3
        ? "Solo se permiten imágenes jpg y png"
        : "";

    setFlagsUbicacion((prev) => ({ ...prev, imagen: valid }));
    setTextErrorsUbicacion((prev) => ({
      ...prev,
      imagen: validText,
    }));
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];

    let valid: any = true;
    let validText = "";

    let videoRes = validateVideo(value);

    if (videoRes == 0) {
      valid = undefined;
    } else if (videoRes === 2 || videoRes === 3) {
      valid = false;
    }

    if (videoRes == 1) {
      setUVideo(value);
    } else {
      clearVideo();
    }

    validText =
      videoRes === 1
        ? "Video válido"
        : videoRes === 2
        ? "Solo se permite video con un tamaño menor o igual 200MB"
        : videoRes === 3
        ? "Solo se permiten videos mp4, m4v y webm"
        : "";

    setFlagsUbicacion((prev) => ({ ...prev, video: valid }));
    setTextErrorsUbicacion((prev) => ({
      ...prev,
      video: validText,
    }));
  };

  const clearImg = () => {
    setUImg(null);
    if (inputFileImgUbi.current) {
      inputFileImgUbi.current.value = null;
    }
  };

  const clearVideo = () => {
    setUVideo(null);
    if (inputFileVideoUbi.current) {
      inputFileVideoUbi.current.value = null;
    }
  };

  return (
    <Layout>
      <PageTitle>Editar Pagina Principal - Bienestar Universitario</PageTitle>
      <SectionTitle>Datos Generales*</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre del modulo</span>
          <Input
            value={moduloData.nombremodulo}
            valid={flagsNombreModulo.nombreModulo}
            className="mt-1"
            placeholder="Escriba aquí el nombre del modulo"
            onChange={(e) => handleChange(e, "nombremodulo")}
          />
          {flagsNombreModulo.nombreModulo != null && (
            <HelperText valid={flagsNombreModulo.nombreModulo}>
              {textErrorsNombreModule.nombreModulo}
            </HelperText>
          )}
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
          {requisitosData.data.map((req, index) => (
            <div className="my-3" key={req.identificador}>
              <RequisitoInputs
                index={index}
                identificador={req.identificador}
                valueTitulo={req.descripcion}
                handle={handleChange2}
                hadleDelete={handleDeleteRequisitos}
              />
              {req.pasosRequisito.map((paso, index) => (
                <div className="my-3" key={paso.identificador}>
                  <RequisitoPasosInputs
                    index={index}
                    identificadorReq={req.identificador}
                    identificador={paso.identificador}
                    valueDescripcion={paso.nombre}
                    handle={handleChange1}
                  />
                </div>
              ))}
            </div>
          ))}

          {inputsReq}
        </Label>
        <div className="flex flex-row-reverse ...">
          <div>
            <Button size="small" onClick={handleAddRequisitos}>
              +
            </Button>
          </div>
        </div>

        <div className="flex">
          <div className="mx-2 mt-4">
            <Button size="large" onClick={() => editarRequisitos(numId)}>
              Editar
            </Button>
          </div>
          <div className="mx-2 mt-4">
            <Modal
              pageRender={
                <EliminarRequisitos
                  title="Bienestar Universitario"
                  pathEnable={`Requisitos/getRequisitosByModuloId/${numId}`}
                  pathDisable={`Requisitos/getDisabledRequisitosByModuloId/${numId}`}
                />
              }
              buttonName="Gestionar Requisitos"
            />
          </div>
        </div>
      </div>
      <SectionTitle>Contactos de referencia</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          {referenciaData.data.map((ref, index) => (
            <div className="my-3" key={ref.identificador}>
              <ReferenciaInputs
                index={index}
                identificador={ref.identificador}
                valueNombre={ref.nombre}
                valueContacto={ref.numero}
                handle={handleChange3}
                hadleDelete={handleDeleteReferencias}
                flag={flagsReferencia[index]}
                textFlag={textErrorsReferencia[index]}
              />
            </div>
          ))}

          {inputsRef}
        </Label>
        <div className="flex flex-row-reverse ...">
          <div>
            <Button size="small" onClick={handleAddReferencias}>
              +
            </Button>
          </div>
        </div>
        <div className="flex">
          <div className="mx-2 mt-4">
            <Button size="large" onClick={() => editarReferencias(numId)}>
              Editar
            </Button>
          </div>
          <div className="mx-2 mt-4">
            <Modal
              pageRender={
                <EliminarReferencia
                  title="Bienestar Universitario"
                  pathEnable={`Referencia/getReferenciasbyModuloId/${numId}`}
                  pathDisable={`Referencia/getDisabledReferenciasbyModuloId/${numId}`}
                />
              }
              buttonName="Gestionar Contactos"
            />
          </div>
        </div>
      </div>
      <SectionTitle>Ubicación</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Descripción</span>
          <Input
            value={
              ubicacionData.descripcion === null
                ? ""
                : ubicacionData.descripcion
            }
            className="mt-1"
            placeholder="Ingrese la ubicación del servicio"
            onChange={(e) => handleChange4(e, "descripcion")}
          />
          {flagsUbicacion.descripcion != null && (
            <HelperText valid={flagsUbicacion.descripcion}>
              {textErrorsUbicacion.descripcion}
            </HelperText>
          )}
        </Label>
        <hr className="mt-4" />
        <Label className="mt-4">
          <span className=" text-lg">Imagen de la ubicación del servicio</span>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <span>Imagen Actual</span>
                <div className="w-64 h-64 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      ubicacionBkData.imagen === null
                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                        : ubicacionBkData.imagen
                    }
                    alt="Imagen de Ubicación actual"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <span>Nueva Imagen</span>
                <div className="w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      ubicacionImg === null
                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png"
                        : URL.createObjectURL(ubicacionImg)
                    }
                    alt="Imagen de Ubicación Nueva"
                  />
                </div>
              </div>
            </div>
          </div>
          <Input
            ref={inputFileImgUbi}
            type="file"
            className="mt-1"
            placeholder="Imagen para ubicación"
            accept="image/jpeg, image/png"
            onChange={(e) => handleImageChange(e)}
          />
          {flagsUbicacion.imagen != null && (
            <HelperText valid={flagsUbicacion.imagen}>
              {textErrorsUbicacion.imagen}
            </HelperText>
          )}
        </Label>
        <hr className="mt-4" />
        <Label className="mt-4">
          <span className=" text-lg">Video de la ubicación del servicio</span>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <span>Video Actual</span>
                <div className="w-96 h-48 border-2 my-2 border-gray-500 rounded-lg overflow-hidden">
                  <VideoPlayer
                    url={
                      ubicacionData.video === null ? "" : ubicacionData.video
                    }
                    width="384"
                    height="224"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <span>Nuevo Video</span>
                <div className="w-96 h-48 border-2 border-gray-500 rounded-lg overflow-hidden">
                  <VideoPlayer
                    url={
                      ubicacionData.video === null ? "" : ubicacionData.video
                    }
                    width="384"
                    height="224"
                  />
                </div>
              </div>
            </div>
          </div>
          <Input
            ref={inputFileVideoUbi}
            type="file"
            className="mt-1"
            placeholder="Video para ubicación"
            accept="video/mp4,video/x-m4v,video/webm"
            valid={flagsUbicacion.video}
            onChange={(e) => handleVideoChange(e)}
          />
          {flagsUbicacion.video != null && (
            <HelperText valid={flagsUbicacion.video}>
              {textErrorsUbicacion.video}
            </HelperText>
          )}
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
