"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/lib/firebase";

interface SensorData {
  temperature?: number;
  sound?: number;
  motion?: number;
  status?: string;
}

export default function Home() {
  const [data, setData] = useState<SensorData>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, "sensor");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const value = snapshot.val();

        if (value) {
          setData(value);
          setConnected(true);
        }
      },
      () => {
        setConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Sleep Monitor
          </h1>

          <p className="text-slate-400 mt-2">
            Sistem Analisis Kualitas Tidur
          </p>

          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                connected
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {connected ? "Terhubung" : "Tidak Terhubung"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">Suhu</p>

            <h2 className="text-4xl font-bold mt-3">
              {data.temperature ?? "--"}°C
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">Kebisingan</p>

            <h2 className="text-4xl font-bold mt-3">
              {data.sound ?? "--"}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">Pergerakan</p>

            <h2 className="text-4xl font-bold mt-3">
              {data.motion === 1 ? "Ada" : "Tidak Ada"}
            </h2>
          </div>

        </div>

        <div className="mt-6 bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <p className="text-slate-400">
            Status Tidur
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {data.status ?? "Menunggu data..."}
          </h2>
        </div>

      </div>
    </main>
  );
}
