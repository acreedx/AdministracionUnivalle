import React, { useState, useEffect } from "react";

import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
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
  Button,
  Pagination,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";

import  { IListarServicios } from "utils/interfaces/servicios";
import Layout from "example/containers/Layout";
import Link from "next/link";
// make a copy of the data, for the second table

function BienestarUniversitario() {


  // setup pages control for every table
  const [pageTable2, setPageTable2] = useState(1);

  // setup data for every table
  const [dataTable2, setUserInfo] = useState<IListarServicios[]>([]);
  const [TotalResult,setTotal]= useState(Number);
  // pagination setup
  const resultsPerPage = 10;


  // pagination change control
  function onPageChangeTable2(p: number) {
    setPageTable2(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data


  // on page change, load new sliced data
  // here you would make another server request for new data
 useEffect(() => {
    const getData = async () => {
      const query = await fetch('http://apisistemaunivalle.somee.com/api/Servicios/getServicioByModuloId/1');
      const response:any= await query.json();
      setTotal(response.data.length);
      setUserInfo(response.data.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage));
    }
    getData();
  }, [pageTable2]);

  return (
    <Layout>
      <PageTitle>Listar Servicios - Consultorio Odontologico</PageTitle>

      <SectionTitle>Servicio</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Servicio</TableCell>
              <TableCell>Modulo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            
            {
              dataTable2.map((datos:any, i) => (
              <TableRow key={datos}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={datos.imagen}
                    />
                    <div>
                      
                      <p className="font-semibold">{datos.nombre}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{datos.modulo}</span>
                </TableCell>
                 <TableCell>
                  <Badge></Badge>
                </TableCell> 
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Link href={{pathname: `/bienestarUniversitario/editar/${datos.identificador}`}}>
                    <Button layout="link" size="small" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    </Link>
                    <Link href={{pathname: `/bienestarUniversitario/editar/${datos.identificador}`}}>
                    <Button layout="link" size="small" aria-label="Delete">
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                     </Link>
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
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  );
}

export default BienestarUniversitario;
