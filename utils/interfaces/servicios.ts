export interface ICrearServicios {
  Servicio:{
    nombre: string;
    moduloId: number;
    imagenUrl: string | null;
  };
  Ubicacion:{
    descripcion:string | null;
    imagen: string | null;
    video: string | null;
  };
  Requisitos:{
    descripcion: string |null;
  };
  Carrera:{
    nombre: string | null;
  };
  Referencia:{
    nombre: string | null;
    numeroCel: string | null
  };
}

export interface IEditarServicio {
  nombre: string;
  imagenUrl: string | null;
}

export interface IEditarUbicacion {
  descripcion:string | null;
  imagen: string | null;
  video: string | null;
}

export interface IEditarRequisitos{
  descripcion: string |null;
}

export interface IEditarCarrera {
  nombre: string | null;
}

export interface IEditarReferencia {
  nombre: string | null;
  numeroCel: string | null
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
