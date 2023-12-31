export interface ICrearServicios {
  nombre: string;
  moduloId: number;
  imagenUrl: string | null;

  UbicacionAdd: {
    descripcion: string | null;
    imagen: string | null;
    video: string | null;
    serviciosId: number;
  };
  RequisitosAdd: {
    descripcion: string | null;
    serviciosId: number;
  };
  CarreraAdd: {
    nombre: string | null;
    serviciosId: number;
  };
  ReferenciaAdd: {
    nombre: string | null;
    numeroCel: string | null;
    serviciosId: number;
  };
}
export interface ICrearServicio {
  nombre: string;
  moduloId: number;
  imagenUrl: string | null;
}
export interface IEditarServicio {
  nombre: string;
  imagenUrl: string | null;
}
export interface IEditarModulo {
  nombremodulo: string;
}
export interface IEditarUbicacion {
  identificador: number;
  descripcion: string | null;
  imagen: string | null;
  video: string | null;
}

export interface IEditarRequisitos {
  descripcion: string | null;
}
export interface IEditarCarrera {
  nombre: string | null;
}
export interface IEditarReferencia {
  nombre: string | null;
  numeroCel: string | null;
}

export interface IEditarRequisitosArray {
  data: [
    {
      identificador: number;
      descripcion: string | null;
      pasosRequisito: [
        {
          identificador: number;
          nombre: string | null;
        }
      ];
    }
  ];
}
export interface IEditarHorarioArray{
  data:
  [
    {
      idHorarios: number;
      horaInicio: string;
      horaFin: string;
      modulo: string | null;
      servicio: string | null;
      estado: boolean;
      diasAtencion:
      [
        {
          idAtencion:number;
          nombreDia:string|null;
        }
      ] 
    }
  ]
}

export interface IEditarReferenciaArray {
  data: [
    {
      identificador: number;
      nombre: string | null;
      numero: string | null;
    }
  ];
}


export interface IListarServicios {
  data: [
    {
      identificador: number;
      nombre: string | null;
      modulo: string | null;
      imagen: string;
    }
  ];
}

export interface IListarModulos {
  data: [
    {
      identificador: number;
      nombre: string;
      estado: boolean;
    }
  ];
}
