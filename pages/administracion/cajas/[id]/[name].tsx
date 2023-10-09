import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, MenuIcon } from "icons";

import Layout from "example/containers/Layout";

import response, { IRequirementData } from "utils/demo/requirementData";
const response2 = response.concat([]);

function Requisitos() {
  const router = useRouter();
  const { id, name } = router.query;
  /*useEffect(() => {
    async () => {
      const response = await fetch(
        `https://localhost:7066/api/Requisitos/getRequisitosByServiceId/${id}`
      );
      var data: ICajasData[] = await response.json();
    };
  });*/
  const [pageTable1, setPageTable1] = useState(1);
  const [pageTable2, setPageTable2] = useState(1);
  const [dataTable1, setDataTable1] = useState<IRequirementData[]>([]);
  const [dataTable2, setDataTable2] = useState<IRequirementData[]>([]);

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
      <PageTitle>Cajas</PageTitle>

      <SectionTitle>Requisitos de {name}</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Descripción requisito</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable2.map((requirement, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{requirement.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge type={"neutral"}>{requirement.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Link 
                      href={`/administracion/cajas/requisitos/editar/[id]`}
                      as={`/administracion/cajas/requisitos/editar/${requirement.id}`}>
                              <Button layout="link" size="small" aria-label="Edit">
                                <EditIcon className="w-5 h-5" aria-hidden="true" />
                              </Button>
                    </Link>
                    <Button layout="link" size="small" aria-label="Delete">
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      <div className="my-4">
        <Link 
            href={`/administracion/cajas/requisitos/crear/[id]`}
            as={`/administracion/cajas/requisitos/crear/${id}`}>
          <Button size="regular">Añadir nuevo requisito</Button>
          </Link>
        </div>
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

export default Requisitos;
