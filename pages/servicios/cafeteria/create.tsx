import React from 'react'
import { Button } from '@roketid/windmill-react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@roketid/windmill-react-ui'
import CTA from 'example/components/CTA'
import PageTitle from 'example/components/Typography/PageTitle'
import SectionTitle from 'example/components/Typography/SectionTitle'
import Link from 'next/dist/client/link'
import Layout from 'example/containers/Layout'
import { MailIcon } from 'icons'

function Forms() {
  return (
    <Layout>
      <PageTitle>Registrar un nuevo elemento de menu</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form>
          <Label className='mt-2'>
            <span>Nombre</span>
            <Input className="mt-1" placeholder="Ingrese el nombre del menu" />
          </Label>

          <Label className='mt-4'>
            <span>Descripcion</span>
            <Input className="mt-1" placeholder="Ingrese una pequeña descripcion" />
          </Label>

          <Label className='mt-4'>
            <span>Precio</span>
            <Input className="mt-1" placeholder="Ingrese el precio" />
          </Label>

          <Label className='mt-4'>
            <span>Imagen</span>
            <Input className="mt-1" placeholder="Ingrese la imagen" />
          </Label>

          <div className='flex justify-items-start gap-4'>
            <div className='mt-8'>
              <Button>Guardar</Button>
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
