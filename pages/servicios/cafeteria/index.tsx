"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
import router, { useRouter } from "next/router";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Card,
  CardBody,
  Button,
  Pagination,
  Input,
  Label,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon } from "icons";
import Layout from "example/containers/Layout";
import { route } from "next/dist/server/router";
import { ICafeteriaData } from "utils/demo/cafeteriaData";
import URLS from "utils/demo/api";


import withAuthorization from "components/withAuthorization";

const requiredPermissions = ["Cafeteria"];


function Cafeteria() {

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [pageTable2, setPageTable2] = useState(1);
  const [dataTable2, setMenuinfo] = useState<ICafeteriaData[]>([]);
  const [TotalResult,setTotal]= useState(Number);
  const resultsPerPage = 10;
  const [state, setState] = useState("activos");
  function onPageChangeTable2(p: number) {
    setPageTable2(p);
  }
  const categorysArray: string[] = [
    "Jugo/Batido",
    "Sandwich",
    "Postre",
    "Cafe",
    "Desayuno",
    "Especial",
    "Ensalada"
  ]

  useEffect(() => {
    const getData = async () => {
      const query = await fetch(`${URLS.baseUrl}Publicaciones/getPublicacionesbyModuloId/4`);
      const response:any= await query.json();
      //console.log(response)
      setTotal(response.data.length);
      setMenuinfo(response.data.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage));
      //console.log(response.data)
    }
    getData();
  }, [pageTable2]);

  const getDescription = (a:any) =>{
    var description
    a.map((b:any) => {
      if (!categorysArray.includes(b.contenido) && isNaN(b.contenido)) {
        description = b.contenido
      }
    })
    return description
    
  }

  const getCategory = (a:any) =>{
    var category
    a.map((b:any) => {
      if (categorysArray.includes(b.contenido)) {
        category = b.contenido
      }
    })
    return category
  }

  const getPrice = (descripcion:any) =>{
    var price = 0
    descripcion.map((content:any) => {
      if (!isNaN(Number(content.contenido))) {
        price = Number(content.contenido)
      }
    })
    return price
  }
  const handleDeleteProduct = (index:number) =>{
    deleteProduct(index)
  }
  const deleteProduct = async(index:number) =>{
    await fetch(`${URLS.baseUrl}Publicaciones/DeletePublicaciones?id=${index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    /*if (state != "activos") {

      await fetch(`${URL.baseUrl}${restoreServiceRoute}${selectedService}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

    }*/
    router.reload();
  }
  const handleActiveChange = (e: any) => {
    setState(e.target.value);
  };

  return (
    <Layout>
      <PageTitle>Menu Cafeteria</PageTitle>
      <Card className="shadow-md sm:w-3/4">
        <CardBody>
          <input
            type="text"
            placeholder="Buscar..."
            className="mb-4 p-2 border border-gray-600 bg-gray-700 text-white w-full rounded"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardBody>
      </Card>
      
      <div>
        <Button > <Link href={'/servicios/cafeteria/create'}>Registrar nuevo producto</Link></Button>
      </div>

      <TableContainer className="mb-8 mt-4">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            dataTable2
            .filter((producto) => {
                if (searchTerm === "") {
                  return producto;
                } else if (
                  producto.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
                ){
                  return producto;
                }
              })
            .map((menu:any, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{menu.titulo}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge type={"neutral"}>{getCategory(menu.descripcion)}</Badge>
                </TableCell>

                <TableCell>
                  <Badge type={"neutral"}>{getPrice(menu.descripcion)} bs.</Badge>
                </TableCell>

                <TableCell>
                  <Badge type={"neutral"}>{getDescription(menu.descripcion)}</Badge>
                </TableCell>

                <TableCell>
                  <Avatar
                      className="hidden mr-3 md:block"
                      src={menu.archivo}
                    />
                  
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">


                    <Link
                      href={`/servicios/cafeteria/editar/[id]`}
                      as={`/servicios/cafeteria/editar/${menu.identificador}`}
                    >
                      <Button layout="link" size="small" aria-label="Edit">
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Button layout="link" size="small" aria-label="Delete" onClick={() => handleDeleteProduct(menu.identificador)}>
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>


        <TableFooter>
          <Pagination
            totalResults={TotalResult}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Tabla de navegación"
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  );
}

export default withAuthorization(Cafeteria,{requiredPermissions});
