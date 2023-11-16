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
      <div className="flex items-center">
        <div className="w-1/2 pr-2"> {/* Dividir la fila en dos, ajustar el espacio a la derecha */}
          <span>Nombre del Contacto</span>
          <Input
            value={valueNombre === null ? "" : valueNombre}
            placeholder="Escriba el nombre del contacto."
            onChange={(e) => handle(e, identificador, "nombre")}
          />
        </div>
        <div className="w-1/2 pl-2"> {/* Dividir la fila en dos, ajustar el espacio a la izquierda */}
          <span>Número del contacto</span>
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
