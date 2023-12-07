
import React, { useState, useEffect } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'

import { useRouter } from 'next/router'
import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import ChartCard from 'example/components/Chart/ChartCard'
import ChartLegend from 'example/components/Chart/ChartLegend'
import PageTitle from 'example/components/Typography/PageTitle'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from 'icons'
import { isAuthenticated } from "utils/auth/auth";

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@roketid/windmill-react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from 'utils/demo/chartsData'

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import CardModuls from 'components/card_modul'
import SectionTitle from 'example/components/Typography/SectionTitle'

function Home() {

  const router = useRouter();

  //Autentificacion
  useEffect(() => {
    const usuarioAutenticado = isAuthenticated();
    if (!usuarioAutenticado) {
      router.push("/login");
    }
  }, []);

  return (
    <Layout>
      <div className='flex justify-center '>
        <PageTitle>Sistema de Administracion Univalle</PageTitle>
      </div>
      <SectionTitle>Menu</SectionTitle>
      <div className="flex flex-wrap mb-8">
        <div className='w-1/3 p-2'>
          <CardModuls title='Cajas' 
          route="/administracion/cajas" 
          img='https://img2.freepng.es/20180509/jue/kisspng-cash-register-money-computer-icons-payment-busines-5af3bdd5166a83.5085942215259232850918.jpg' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Tramites' 
          route="/administracion/tramites" 
          img='https://th.bing.com/th/id/R.d806f98c740c0b969a21919e20926391?rik=1B1e%2frAbk%2bCrSQ&riu=http%3a%2f%2falexiac.weebly.com%2fuploads%2f1%2f3%2f5%2f3%2f13536969%2f1856030.jpg%3f284&ehk=L%2bv4SqLD7em4Ny4l29%2bnuADt%2bHgUeaXD6N4%2fSiVIOgM%3d&risl=&pid=ImgRaw&r=0' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Dirección de carreras' 
          route="/administracion/direccionDeCarrera/carrera" 
          img='https://previews.123rf.com/images/bsd555/bsd5552108/bsd555210805372/173530462-icono-de-color-rgb-del-director-ejecutivo-ceo-de-la-corporaci%C3%B3n-director-general-administrador.jpg' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Cafeteria' 
          route="/servicios/cafeteria" 
          img='https://media.istockphoto.com/id/646314156/vector/restaurant-icon-isolated-vector.jpg?s=612x612&w=0&k=20&c=2qFLVCalkUeQEo75tuBarbGy30Rbvr4bUfalsW9o1cw=' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Usuarios' 
          route="/usuarios/listarUsuarios" 
          img='https://conocimiento.blob.core.windows.net/conocimiento/2022/Contables/ContabilidadBancos/CasosPracticos/CP_Usuarios_y_perfiles/drex_usuarios_y_perfiles_custom.png' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Bienestar universitario' 
          route="/bienestarUniversitario/listarServicios" 
          img='https://static.vecteezy.com/system/resources/previews/006/310/372/non_2x/business-people-with-magnifier-and-computer-searching-new-information-explore-and-business-concept-of-data-research-and-information-cartoon-illustration-isolated-on-white-background-vector.jpg' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Gabinete Medico' 
          route="/gabineteMedico/listarServicios" 
          img='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/hospital-logo-design-template-572099cf985a4fb94c4d8a9700a685a6_screen.jpg?ts=1666871753' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Gabinete Psico-Pedagogico' 
          route="/gabinetePsicoPedagogico/listarServicios" 
          img='https://1.bp.blogspot.com/-ZH_OS8-Thhc/VwJwbc3dwzI/AAAAAAAAdP8/c237oZfeAFUe9oK442padKYsys2wuPzIQ/s1600/psi.jpg' />
        </div>
        <div className='w-1/3 p-2'>
          <CardModuls title='Clinica Odontológica' 
          route="/consultorioOdontologico/listarServicios" 
          img='https://img.freepik.com/vector-premium/adhesivo-linea-clinica-dental-icono-dentista-logotipo-odontologia-estomatologia-concepto-cuidado-dientes-vector-sobre-fondo-aislado-eps-10_399089-2404.jpg?w=2000' />
        </div>
      </div>
    </Layout>
  );
}

export default Home;
