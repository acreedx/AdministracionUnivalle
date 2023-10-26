import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { IEditarproducto, IProductData, convertJSONService } from "../../../../utils/interfaces/menuCafeteria";
import { Input, Label, Select } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import {
  successAlert,
  errorAlert,
  warningAlert,
} from "../../../../components/alerts";
import {uploadFile} from "../../../../firebase/config"
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

interface props {
  id: number;
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  return {
    props: {
      id,
    },
  };
}

function EditarProducto({ id }: props) {
  const FlechaIMG = "https://firebasestorage.googleapis.com/v0/b/proveedoresfarmacia-a4ba2.appspot.com/o/Flecha.png?alt=media&token=9ca07039-819c-42cc-a1d5-0c9b509b1e3b&_gl=1*bye4hh*_ga*Nzk1NTIyMzkxLjE2OTY0NjQ2ODM.*_ga_CW55HF8NVT*MTY5ODM1MDU3OC4xNC4xLjE2OTgzNTA2NzIuMjYuMC4w"
  const router = useRouter();

  const [serviceImg, setImg]:any = useState(null);

  const [service, setService] = useState<IProductData>();
  const [titulo, setTitulo] = useState("");
  const [archivo, setArchivo] = useState("");

  const [imagenSeleccionada, setImagenSeleccionada] = useState("");

  const handleImagenSeleccionada = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = (e) => {
        const result = e.target?.result
        if(result)
          setImagenSeleccionada(result as string);
      };
      lector.readAsDataURL(archivo);
    }
  };
  

  useEffect(() => {
    async function doFetch() {
      fetch(`http://apisistemaunivalle.somee.com/api/Publicaciones/GetPublicacionByID/${id}`)
        .then((res) => res.json())
        .then((res) => setService(convertJSONService(res.data)));
    }
    doFetch();
  }, []);

  //console.log(service)

  useEffect(() => {
    if (service?.titulo) {
      setTitulo(service!.titulo);
      setArchivo(service!.archivo);
    }
  }, [service]);

  const [productoData, setproductoData] = useState<IEditarproducto>({
    archivo: "",
    titulo: "",
    descripcionPublicacion:[
      {
        id: 0,
        contenido: ""
      },
      {
        id: 0,
        contenido: ""
      },
      {
        id: 0,
        contenido: ""
      }
    ]
  });

  const handleSubmit = async () => {
    setproductoData({
      ...productoData,
      archivo: "",
      titulo: "",
      descripcionPublicacion:[
        {
          id: 0,
          contenido: ""
        },
        {
          id: 0,
          contenido: ""
        },
        {
          id: 0,
          contenido: ""
        }
      ]
    })
    await fetch(`http://apisistemaunivalle.somee.com/api/Publicaciones/UpdatePublicacionesWithDescription/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({productoData}),
    });
    router.back();
  };

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
          id: 0,
          contenido: category
        },
        {
          id: 0,
          contenido: productoData.descripcionPublicacion[1].contenido
        },
        {
          id: 0,
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
          id: 0,
          contenido: productoData.descripcionPublicacion[0].contenido
        },
        {
          id: 0,
          contenido: productoData.descripcionPublicacion[1].contenido
        },
        {
          id: 0,
          contenido: description
        }
      ]
      
    });
  };

  const handleChange3 = (e: ChangeEvent<HTMLInputElement>) => {
    price = e.target.value
    setproductoData({
      ...productoData,
      descripcionPublicacion: [
        {
          id: 0,
          contenido: productoData.descripcionPublicacion[0].contenido
        },
        {
          id: 0,
          contenido: price
        },
        {
          id: 0,
          contenido: productoData.descripcionPublicacion[2].contenido
        }
      ]
      
    });
  };
  
  const subirArchivos = async () =>{
    productoData.archivo= null;
    if(serviceImg != null)
    {
      productoData.archivo= await uploadFile(serviceImg,"menuCafeteria/");
    } 
    handleSubmit();
  }
  return (
    <Layout>
      <PageTitle>Registrar un nuevo producto</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form>
          <Label className='mt-2'> 
            <span>Nombre</span>
            <Input 
              value={titulo}
              className="mt-1" 
              placeholder="Ingrese el nombre del menu" 
              onChange={(e) => setTitulo(e.target.value)}/>
              
          </Label>

          <Label className='mt-4'>
            <span>Categoria</span>
            <Select className="mt-1" onChange={(e) => handleChange1(e)}>
              <option value="" >Seleccione una Categoria</option>
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
              onChange={e =>{
                setImg(e.target.files?.[0] || null)
                handleImagenSeleccionada(e)
                //console.log(imagenSeleccionada);
              }}
            />
            <div className="flex mt-4 grid-cols-3">
              <img className="" src={service?.archivo} width="35%"/>
              <img className="" src={FlechaIMG} width="30%" height="300"/>
              <img className="" src={imagenSeleccionada} width="35%"/>
            </div>
            
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

export default EditarProducto
