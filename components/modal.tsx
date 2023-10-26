import { FC,ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "@roketid/windmill-react-ui";

interface ModalProps {
  pageRender:any;
  buttonName:string;
}
const ModalPage: FC<ModalProps> = ({
 pageRender,
 buttonName
}) => {
   const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        
          type="button"
          onClick={() => setShowModal(true)}
        >
          {buttonName}
        </Button>
       {showModal ? (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="w-fit bg-gray-900  rounded-lg shadow-xl p-3">
            <h2 className="text-base text-gray-400 font-semibold text-center">
              {pageRender}
            </h2>
            <Button
              className="mt-1 w-full  rounded-md shadow hover:shadow-lg font-semibold py-2"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default ModalPage;