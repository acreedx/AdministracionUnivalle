import { FC, ChangeEvent } from "react";
import { HelperText, Input, Label, Textarea } from "@roketid/windmill-react-ui";
import { Button } from "@roketid/windmill-react-ui";
interface ReferenciaInputsProps {
  index: number;
  valueNombre: string | null;
  valueContacto: string | null;
  identificador: number;
  handle: (e: ChangeEvent<HTMLInputElement>, id: number, campo: string) => void;
  hadleDelete: (id: number) => void | null;
  flag: any;
  textFlag: any;
}

const ReferenciaInputs: FC<ReferenciaInputsProps> = ({
  index,
  valueNombre,
  valueContacto,
  handle,
  identificador,
  hadleDelete,
  flag,
  textFlag,
}) => {
  const isNuevoContacto = identificador === null || identificador < 0;
  return (
    <>
      <div className="text-lg">
        {isNuevoContacto
          ? "Nuevo Contacto"
          : `Contacto ${isNuevoContacto ? "" : index + 1}`}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-full">
          <span>Nombre del Contacto</span>
          <Input
            value={valueNombre === null ? "" : valueNombre}
            placeholder="Escriba el nombre del contacto."
            onChange={(e) => handle(e, identificador, "nombre")}
          />
          {flag && flag.nombre != null && (
            <HelperText valid={flag.nombre}>{textFlag.nombre}</HelperText>
          )}
        </div>
        <div className="mx-1"></div>
        <div className="flex flex-col w-full">
          <span>Número del Contacto</span>
          <Input
            value={valueContacto === null ? "" : valueContacto}
            placeholder="Escriba el número del contacto."
            onChange={(e) => handle(e, identificador, "numero")}
          />
          {flag && flag.numero != null && (
            <HelperText valid={flag.numero}>{textFlag.numero}</HelperText>
          )}
        </div>
        <div className=" mx-1"></div>
        {isNuevoContacto ? (
          <Button size="small" onClick={() => hadleDelete(identificador)}>
            -
          </Button>
        ) : null}
      </div>

      <hr className="mt-3" />
    </>
  );
};
export default ReferenciaInputs;
