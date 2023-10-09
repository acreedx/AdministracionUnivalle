import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
import { Input, HelperText, Label, Select, Textarea } from '@roketid/windmill-react-ui'
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
import { EditIcon, TrashIcon, MenuIcon } from "icons";

import response, { ICajasData } from "utils/demo/cajasData";
import Layout from "example/containers/Layout";

const response2 = response.concat([]);

      /*<Label>
          <span>Horarios de atención</span>
          <Input className="mt-1" placeholder="Jane Doe" />
      </Label>
      <Label>
          <span>Ubicación</span>
          <Input className="mt-1" placeholder="Jane Doe" />
      </Label>
      <Label>
          <span>Imagen</span>
          <Input className="mt-1" placeholder="Jane Doe" />
      </Label>
      <Label>
          <span>Video de referencia</span>
          <Input className="mt-1" placeholder="Jane Doe" />
      </Label>*/
      
function Cajas() {
  const ModuleId = 2;
  const [pageTable1, setPageTable1] = useState(1);
  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable1, setDataTable1] = useState<ICajasData[]>([]);
  const [dataTable2, setDataTable2] = useState<ICajasData[]>([]);

  const resultsPerPage = 10;
  const totalResults = response.length;
useEffect(() => {
        fetch(`http://swapi.co/api/people/1/`)
        .then(res => res.json())
        .then((res) => {
          console.log(res);
        });
      });
  function onPageChangeTable1(p: number) {
    setPageTable1(p);
  }

  function onPageChangeTable2(p: number) {
    setPageTable2(p);
  }

  useEffect(() => {
    setDataTable1(
      response.slice(
        (pageTable1 - 1) * resultsPerPage,
        pageTable1 * resultsPerPage
      )
    );
  }, [pageTable1]);

  useEffect(() => {
    setDataTable2(
      response2.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2]);

  return (
    <Layout>
      <PageTitle>Cajas</PageTitle>

      <SectionTitle>Listado de servicios de cajas</SectionTitle>
      <TableContainer className="my-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Servicio</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Encargado</TableCell>
              <TableCell>Telefono de Referencia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable2.map((servicio, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{servicio.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{servicio.ubicacion}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{servicio.encharged}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{servicio.cellphone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type={"neutral"}>{servicio.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/administracion/cajas/editar/[id]`}
                      as={`/administracion/cajas/editar/${servicio.id}`}
                    >
                    <Button layout="link" size="small" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    </Link>
                    <Button layout="link" size="small" aria-label="Delete">
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Link
                      href={`/administracion/cajas/[id]/[name]`}
                      as={`/administracion/cajas/${servicio.id}/${servicio.name}`}
                    >
                      <Button layout="link" size="small" aria-label="Ver">
                        <MenuIcon className="w-5 h-5" aria-hidden="true" />
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
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Tabla de navegación"
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  );
}

export default Cajas;
