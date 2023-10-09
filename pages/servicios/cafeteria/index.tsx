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
  Button,
  Pagination,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon } from "icons";

import response, { ICajasData } from "utils/demo/cajasData";
import Layout from "example/containers/Layout";
import { route } from "next/dist/server/router";

const response2 = response.concat([]);

function Cafeteria() {

  const router = useRouter()
  const ModuleId = 2;
  const [pageTable1, setPageTable1] = useState(1);
  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable1, setDataTable1] = useState<ICajasData[]>([]);
  const [dataTable2, setDataTable2] = useState<ICajasData[]>([]);

  const resultsPerPage = 10;
  const totalResults = response.length;

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
      <PageTitle>Cafeteria</PageTitle>

      <div>
        <Button > <Link href={'/servicios/cafeteria/create'}>Crear</Link></Button>

      </div>

      <TableContainer className="mb-8 mt-4">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Imagen</TableCell>
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
                  <Badge type={"neutral"}>{servicio.status}</Badge>
                </TableCell>

                <TableCell>
                  <Badge type={"neutral"}>{servicio.status}</Badge>
                </TableCell>

                <TableCell>
                  <Badge type={"neutral"}>{servicio.status}</Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="small" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
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

export default Cafeteria;
