"use client";
import { motion, useAnimate } from "motion/react"
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import NumberFlow from '@number-flow/react'

const qubitCount = 5;

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

export default function Home() {
  const [scope, animate] = useAnimate();
  const pressed = useRef(false);

  const [heldPercent, setHeldPercent] = useState(0);
  const heldPercentDupe = useRef(0);

  const [QBucks, setQBucks] = useState(400);
  const [upgrade, setUpgrade] = useState(0);
  const [qubits, setQubits] = useState<Array<string | null>>(Array.from({ length: qubitCount }, () => null));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const vibrateQubit = (num: number) => {
      animate(
        `.qubits > div:nth-child(${num})`,
        { x: [-2, -2, 2, 2, -2], y: [-2, 2, 2, -2, -2] },
        { duration: .2, repeat: Infinity }
      )
    }

    const vibrate = () => {
      qubits.forEach((_qubit, index) => {
        vibrateQubit(index + 1);
      })
    }

    const MeasureQubit = () => {
      return Math.random() < 0.5 ? '0' : '1';
    }

    const MeasureAnimation = (num: number) => {
      animate(`.qubits > div:nth-child(${num})`, { scale: [1.0, 1.2, 1.0] }, { duration: .35, delay: .1 * num, ease: ["easeInOut"] })
    }

    const MeasureQubits = () => {
      qubits.forEach((_qubit, index) => {
        MeasureAnimation(index + 1);
      })
      const newQubits = Array.from({ length: qubitCount }, () => MeasureQubit());
      setQubits(newQubits);
      const upgradeAmount = newQubits.reduce((sum, val) => sum + Number(val), 0)*6-20;
      setUpgrade(upgradeAmount);
      setQBucks((prev) => prev + upgradeAmount + 20);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && !pressed.current && QBucks >= 20) {
        console.log("pressed");
        animate(".activate", { y: 8 }, { type: "spring", stiffness: 300, damping: 20 });
        pressed.current = true;
        let hasDeducted = false;

        intervalRef.current = setInterval(() => {
          setHeldPercent((prev) => {
            const newValue = Math.min(prev + 2, 100);
            heldPercentDupe.current = newValue;

            if (newValue >= 100 && !hasDeducted) {
              clearInterval(intervalRef.current!);
              intervalRef.current = null;

              setQubits(Array.from({ length: qubitCount }, () => null));
              vibrate();
              setQBucks((q) => q - 20);
              setUpgrade(0);
              hasDeducted = true;
            }

            return newValue;
          });
        }, 20);

      }
    };


    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key == " ") {
        animate(".activate", { y: 0 }, { type: "spring", stiffness: 300, damping: 20 });
        animate(".qubit, .qubit-text", { x: 0, y: 0 });
        pressed.current = false;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (heldPercentDupe.current >= 100) {
          MeasureQubits();
        }
        setHeldPercent(0);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [animate])


  return (
    <main className="flex justify-center">
      <div ref={scope} className="w-full max-w-[1000px] h-dvh flex flex-col items-center gap-5 md:gap-10 p-10">
        <div className="font-mono text-6xl uppercase font-bold">Quantum Slots</div>
        <div className="flex justify-between w-full max-w-[600px] font-mono text-2xl">
          <NumberFlow value={QBucks} suffix=" QBucks" />
          {upgrade != 0 && <NumberFlow value={upgrade} />}
        </div>
        <div className="qubits flex gap-10 gap-y-5 justify-center flex-wrap">
          {qubits.map((value, index) => <Qubit value={value} key={index} />)}
        </div>
        <div className="activate-button flex relative font-mono">
          <div
            className={clsx("activate bg-white p-4 w-[500px] rounded-2xl text-center uppercase z-10")}
          >
            {heldPercent >= 100 ? "Release Space to Fire" : "Hold Space To Fire Shot (20 QBucks)"}
          </div>
          <div className="activate slider origin-left absolute w-[500px] rounded-2xl text-transparent select-none z-20 overflow-hidden">
            <div className={clsx("h-full py-4 text-nowrap", { "bg-blue-600/20": heldPercent < 100, "bg-green-600/60": heldPercent >= 100 })} style={{ width: heldPercent + "%" }}>
              Hold Space To Fire Shot
            </div>
          </div>
          <div className="absolute text-nowrap text-transparent w-[500px] p-4 bg-black rounded-2xl mt-2">
            Hold Space To Fire Shot
          </div>
        </div>
      </div>
    </main>
  );
}