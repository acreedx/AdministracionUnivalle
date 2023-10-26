import { FC,ChangeEvent } from "react";
import { Input, Label, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
interface RequisitoInputsProps {
  index:number ;
  valueTitulo: string | null;
  identificador:number
  handle: (e: ChangeEvent<HTMLInputElement>,id:number,campo: string) => void;
  hadleDelete: (id:number) => void | null;
}

const RequisitoInputs: FC<RequisitoInputsProps> = ({
  index,
  valueTitulo,
  handle,
  identificador,
  hadleDelete
}) => {
  const isNuevoContacto = identificador === null || identificador < 0;
  return (
    <>
      <div className="text-lg">
        {isNuevoContacto ? "Nuevo Requisito" : `Requisito ${isNuevoContacto ? "" : index + 1}`}
      </div>
      <span>Titulo del Requisito</span>
      <div className="flex">
        <Input
          value={valueTitulo === null ? "" : valueTitulo}
          placeholder="Escriba el titulo del requisito."
          onChange={(e) => handle(e, identificador, "descripcion")}
        />
        <div className=" mx-1" ></div>
        {isNuevoContacto? <Button size="small" onClick={()=>hadleDelete(identificador)}>-</Button>:null}
      </div>

    </>
  );
};
export default RequisitoInputs;
