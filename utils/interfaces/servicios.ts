export interface ICrearServicios {
  nombre: string;
  moduloId: number;
  imagenUrl: string | null;
}

export interface IEditarServicio {
  nombre: string;
  imagenUrl: string | null;
}


export interface IListarServicios{
  data: [
    {
      identificador:number;
      nombre:string | null;
      modulo:string | null;
      imagen:string;
    }
  ]
}
