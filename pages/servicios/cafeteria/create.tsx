import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { ICrearproducto } from "../../../utils/interfaces/menuCafeteria";
import { Input, Label, HelperText,Textarea, Alert, Select } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../components/alerts";
import { ToastContainer } from "react-toastify";
import {uploadFile} from "../../../firebase/config"
import { useRouter } from "next/router";

function Forms() {
  const router = useRouter();
  const [serviceImg, setImg]:any = useState(null);

  const [productoData, setproductoData] = useState<ICrearproducto>({
    archivo: "",
    serviciosId: 43,
    titulo: "",
    id_modulo: 4,
    estado:true,
    descripcionPublicacion:[
      {
        contenido: ""
      },
      {
        contenido: ""
      },
      {
        contenido: ""
      }
    ]
  });

  var category = ""
  var price = ""
  var description = ""

  const handleChange = (e: ChangeEvent<HTMLInputElement>, campo: string) => {
    var titulo
    if(e.target.value != "")
      titulo = e.target.value
    else
      titulo = ""
    
    setproductoData({
      ...productoData,
      [campo]:titulo
    });
  };

  const handleChange1 = (e: ChangeEvent<HTMLSelectElement>) => {
    category = e.target.value
    setproductoData({
      ...productoData,
      descripcionPublicacion: [
        {
          contenido: category
        },
        {
          contenido: productoData.descripcionPublicacion[1].contenido
        },
        {
          contenido: productoData.descripcionPublicacion[2].contenido
        }
      ]
      
    });
  };

  const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    description = e.target.value
    setproductoData({
      ...productoData,
      descripcionPublicacion: [
        {
          contenido: productoData.descripcionPublicacion[0].contenido
        },
        {
          contenido: productoData.descripcionPublicacion[1].contenido
        },
        {
          contenido: description
        }
      ]
      
    });
  };

  const handleChange3 = (e: ChangeEvent<HTMLInputElement>) => {
    price = e.target.value
    console.log(productoData)
    setproductoData({
      ...productoData,
      descripcionPublicacion: [
        {
          contenido: productoData.descripcionPublicacion[0].contenido
        },
        {
          contenido: price
        },
        {
          contenido: productoData.descripcionPublicacion[2].contenido
        }
      ]
      
    });
  };
  const clearData = () => {
    setproductoData({
      ...productoData,
      archivo: "",
      serviciosId: 43,
      titulo: "",
      id_modulo: 4,
      estado: true,
      descripcionPublicacion:[
        {
          contenido: ""
        },
        {
          contenido: ""
        },
        {
          contenido: ""
        }
      ]
    });
  };
  
  const registrarProducto = () => {
    fetch("http://apisistemaunivalle.somee.com/api/Publicaciones/addPublicacionWithDescription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoData),
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          successAlert("Éxito al registrar los datos");
          router.back();
        } else {
          throw new Error("Error al registrar los datos");
        }
      })
      .catch(() => errorAlert("Error al registrar los datos"));
  };
  ///////////////////////////////////////////
  const validarFormulario = () => {
  if (!productoData.titulo.trim()) {
    alert("El campo 'Nombre' no puede estar vacío");
    return false;
  }
   if (!productoData.descripcionPublicacion || productoData.descripcionPublicacion[0].contenido === "") {
    alert("Debe seleccionar una 'Categoria'");
    return false;
  }
  if (!productoData.descripcionPublicacion[2].contenido.trim()) {
    alert("El campo 'Descripcion' no puede estar vacío");
    return false;
  }
  if (!productoData.descripcionPublicacion[1].contenido) {
    alert("El campo 'Precio' no puede estar vacío");
    return false;
  }
  if (parseFloat(productoData.descripcionPublicacion[1].contenido) < 0) {
  alert("El precio no puede ser un número negativo");
  return false;
  }
  if (!serviceImg) {
    alert("Por favor, añada una imagen de referencia del producto");
    return false;
  }
  // Continuar con más validaciones si son necesarias
  return true;
};

  //////////////////////////////////////////
  const subirArchivos = async () =>{
    if(!validarFormulario()){
      return;
    }
    productoData.archivo= null;
    if(serviceImg != null)
    {
      productoData.archivo= await uploadFile(serviceImg,"menuCafeteria/");
    } 
    registrarProducto();
  }
  return (
    <Layout>
      <PageTitle>Registrar un nuevo producto</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form>
          <Label className='mt-2'>
            <span>Nombre</span>
            <Input 
              value={productoData.titulo}
              className="mt-1" 
              placeholder="Ingrese el nombre del menu" 
              onChange={(e) => handleChange(e, "titulo")}/>
              
          </Label>

          <Label className='mt-4'>
            <span>Categoria</span>
            <Select className="mt-1" onChange={(e) => handleChange1(e)}>
              <option value="">Seleccione una Categoria</option>
              <option value="Jugo/Batido">Jugo/Batido</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Postre">Postre</option>
              <option value="Cafe">Cafe</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Especial">Especial</option>
              <option value="Ensalada">Ensalada</option>
              
            </Select>

          </Label>

          <Label className='mt-4'>
            <span>Descripcion</span>
            <Input 
              value={productoData.descripcionPublicacion[2].contenido}
              className="mt-1" 
              placeholder="Ingrese la descripcion del producto" 
              onChange={(e) => handleChange2(e)}/>
          </Label>

          <Label className='mt-4'>
            <span>Precio</span>
            <Input 
              value={productoData.descripcionPublicacion[1].contenido}
              className="mt-1"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Ingrese el precio del producto" 
              onChange={(e) => handleChange3(e)}/>
          </Label>

          <Label className="mt-4">
          <span>Imagen de referencia del producto</span>
          <Input
            type="file"
            className="mt-1"
            onChange={e => setImg(e.target.files?.[0] || null)}
          />
        </Label>

          <div className='flex justify-items-start gap-4'>
            <div className='mt-8'>
              <Button onClick={subirArchivos}>Guardar</Button>
            </div>
            <div className='mt-8'>
              <Button>  <Link href={'/servicios/cafeteria'} > Regresar </Link></Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default Forms
