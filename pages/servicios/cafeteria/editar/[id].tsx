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
import URLS from "utils/demo/api";

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
  const categorysArray: string[] = [
    "Jugo/Batido",
    "Sandwich",
    "Postre",
    "Cafe",
    "Desayuno",
    "Especial",
    "Ensalada"
  ]
  const router = useRouter();

  const [serviceImg, setImg]:any = useState(null);

  const [service, setService] = useState<IProductData>();
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [idCategoria, setIdCategoria] = useState(Number);
  const [precio, setPrecio] = useState(Number);
  const [idPrecio, setIdPrecio] = useState(Number);
  const [descripcion, setDescripcion] = useState("");
  const [idDescripcion, setIdDescripcion] = useState(Number);
  

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
      fetch(`${URLS.baseUrl}Publicaciones/GetPublicacionByID/${id}`)
        .then((res) => res.json())
        .then((res) => setService(convertJSONService(res.data)));
        
    }
    doFetch();
  }, []);

  //console.log(service)

  useEffect(() => {
    if (service?.titulo) {
      setTitulo(service!.titulo);
      setCategoria(getCategory(service!.descripcionPublicacion)!);
      setPrecio(getPrice(service!.descripcionPublicacion)!);
      setDescripcion(getDescription(service!.descripcionPublicacion)!);
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
    
    console.log(JSON.stringify({
        archivo: productoData.archivo,
        titulo: titulo,
        descripcionPublicacion:[
          {
            id: idCategoria,
            contenido: categoria
          },
          {
            id: idPrecio,
            contenido: precio.toString()
          },
          {
            id: idDescripcion,
            contenido: descripcion
          }
        ]
      }));
    
    await fetch(`${URLS.baseUrl}Publicaciones/UpdatePublicacionesWithDescription/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        archivo: productoData.archivo,
        titulo: titulo,
        descripcionPublicacion:[
          {
            id: idCategoria,
            contenido: categoria
          },
          {
            id: idPrecio,
            contenido: precio.toString()
          },
          {
            id: idDescripcion,
            contenido: descripcion
          }
        ]
      }),
    });
    router.back();
  };

  var price = ""
  var description = ""

  const getDescription = (a:any) =>{
    var description
    a.map((b:any) => {
      if (!categorysArray.includes(b.contenido) && isNaN(b.contenido)) {
        description = b.contenido
        setIdDescripcion(b.idDescripcion)
      }
    })
    return description
    
  }

  const getCategory = (a:any) =>{
    var category
    a.map((b:any) => {
      if (categorysArray.includes(b.contenido)) {
        category = b.contenido
        setIdCategoria(b.idDescripcion)
      }
    })
    return category
  }

  const getPrice = (descripcion:any) =>{
    var price = 0
    descripcion.map((content:any) => {
      if (!isNaN(Number(content.contenido))) {
        price = Number(content.contenido)
        setIdPrecio(content.idDescripcion)
      }
    })
    return price
  }

  const handleChange1 = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value)
  };
  ////////////////////
   const validarFormulario = () => {
    console.log(categoria)
  if (!titulo.trim()) {
    alert("El campo 'Nombre' no puede estar vacío");
    return false;
  }
   if (!categoria.trim()) {
    alert("Debe seleccionar una 'Categoria'");
    return false;
  }
  if (!descripcion.trim()) {
    alert("El campo 'Descripcion' no puede estar vacío");
    return false;
  }
  if (!precio) {
    alert("El campo 'Precio' no puede estar vacío");
    return false;
  }
  if (precio < 0) {
  alert("El precio no puede ser un número negativo");
  return false;
  }
  if (!productoData.archivo) {
    alert("Por favor, añada una imagen de referencia del producto");
    return false;
  }
  // Continuar con más validaciones si son necesarias

  return true;
};

  //////////////////
  const subirArchivos = async () =>{
    if(!validarFormulario()){
      return;
    }
    productoData.archivo= null;
    if(serviceImg != null)
    {
      productoData.archivo = await uploadFile(serviceImg,"menuCafeteria/");
    } 
    
    handleSubmit();
  }
  return (
    <Layout>
      <PageTitle>Editar producto</PageTitle>
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
              value={descripcion}
              className="mt-1" 
              placeholder="Ingrese la descripcion del producto" 
              onChange={(e) => setDescripcion(e.target.value)}/>
          </Label>

          <Label className='mt-4'>
            <span>Precio</span>
            <Input 
              value={precio}
              className="mt-1"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Ingrese el precio del producto" 
              onChange={(e) => setPrecio(Number(e.target.value))}/>
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
