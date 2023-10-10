export interface ICrearServicios {
  Servicio:{
    nombre: string;
    moduloId: number;
    imagenUrl: string | null;
  };
  Ubicacion:{
    Descripcion:string | null;
    Imagen: string | null;
    Video: string | null;
  };
  Requisitos:{
    Descripcion: string | null;
  };
  Carrera:{
    Nombre: string | null;
  };
  Referencia:{
    Nombre: string | null;
    NumeroCel: string | null
  };
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
