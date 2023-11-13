export interface IRegistrarUsuario{
    ciUsuario:string;
    clave:string;
    nombres:string;
    apellidos:string;
    cargoId:number;
}
export interface IListarUsuario{
  data:
  [
    {
      ci:string;
      nombres:string;
      apellidos:string;
      cargo:number;
      estado:boolean;
    }
  ]
    
}
export interface IListarCargos{
  data:
  [
    {
      id:number;
      nombrecargo:string;
      estado:boolean;
    }
  ];
    
}