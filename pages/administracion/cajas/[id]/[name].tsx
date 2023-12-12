import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import URL from "utils/demo/api";
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
import { EditIcon, TrashIcon } from "icons";
import Layout from "example/containers/Layout";
import response, {
  IRequirementData,
  convertJSONListRequirement,
} from "utils/demo/requirementData";
import { GetServerSidePropsContext } from "next";
import withAuthorization from "components/withAuthorization";

const requiredPermissions = ["Cajas"];

interface props {
  id: number;
  name: number;
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id, name } = context.query;
  return {
    props: {
      id,
      name,
    },
  };
}

const response2 = response.concat([]);

function Requisitos({ id, name }: props) {
  const route = "Requisitos/getRequisitosByServiceId/";
  const [pageTable, setPageTable] = useState(1);
  const [requirements, setRequirements] = useState<IRequirementData[]>([]);

  const resultsPerPage = 10;

  const totalResults = response.length;

  useEffect(() => {
    async function doFetch() {
      fetch(`${URL.baseUrl}${route}${id}`)
        .then((res) => res.json())
        .then((res) =>
          res.data != null
            ? setRequirements(convertJSONListRequirement(res.data))
            : console.log("No se encontraron requisitos")
        );
    }
    doFetch();
  }, []);

  function onPageChangeTable(p: number) {
    setPageTable(p);
  }

  useEffect(() => {
    setRequirements(
      requirements.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
  }, [pageTable]);

  return (
    <Layout>
      <PageTitle>Cajas</PageTitle>
      <SectionTitle>Requisitos de {name}</SectionTitle>
      <div className="mb-4">
        <Link href={`/administracion/cajas`}>
          <Button size="small">
            <span className="mr-2" aria-hidden="true">
              {"←"}
            </span>
            Volver
          </Button>
        </Link>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Descripción requisito</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {requirements.map((requirement, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{requirement.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/administracion/cajas/requisitos/editar/[id]`}
                      as={`/administracion/cajas/requisitos/editar/${requirement.id}`}
                    >
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
            as={`/administracion/cajas/requisitos/crear/${id}`}
          >
            <Button size="regular">Añadir nuevo requisito</Button>
          </Link>
        </div>
      </TableContainer>
    </Layout>
  );
}

export default Requisitos;
