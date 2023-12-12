import { FC, ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "@roketid/windmill-react-ui";
import Link from "next/link";
import Image from "next/dist/client/image";

interface CardModulsProps {
  img: string;
  title: string;
  route: string
}
const CardModuls: FC<CardModulsProps> = ({ img, title, route }) => {
  return (
    <>
    <div className=" cursor-pointer max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Link href={{
            pathname: route,
          }}>
            <img className="rounded-t-lg h-64 w-full object-cover"  src={img} alt="" />
        </Link>
        <div className="p-5">
            <Link href={{
            pathname: route,
            }}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
            </Link>
            <Link href={{
            pathname: route,
            }} >
              <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Ir a la pagina  <span className=" mr-2"></span>
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
                </div>
            </Link>
        </div>
    </div>

    </>
  );
};
export default CardModuls;