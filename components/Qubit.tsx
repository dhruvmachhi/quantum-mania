/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import clsx from "clsx";

export function Qubit({ value }: { value: string | null }) {
  return (
    <div className={clsx("qubit w-38 h-38 md:w-38 md:h-38 border-4 rounded-2xl flex flex-col", { "bg-white": value == null, "bg-green-300": value == '1', "bg-red-300": value == '0' })}>
      <div className="qubit-text flex justify-center items-center p-2">
        <img className="w-7" src={"/0.png"} />
        <img className="w-3" src={"/right.png"} />
        <img className="w-7" src={"/H.png"} />
        <img className="w-3" src={"/right.png"} />
        <img className="w-7" src={"/M.png"} />
      </div>
      <hr className="border-2 border-dashed" />
      <div className="flex-1/3 qubit-text p-2 flex items-center justify-center ">
        {value ? <img src={`/${value}.png`} className="w-10 aspect-square" /> : <p className="text-7xl md:text-7xl">?</p>}
      </div>
    </div>
  )
}