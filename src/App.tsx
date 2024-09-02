import { useEffect, useState } from "react";
import WhackAMole from "./components/whickAMole.component"
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import eruda from 'eruda'



function App() {
  const [telegramInfo, setTelegramInfo] = useState<unknown>("");
  useEffect(() => {
    (async () => {
      eruda.init()
      console.log({ retrieveLaunchParams })
      setTelegramInfo(retrieveLaunchParams);
    })();
  }, [])

  return (
    <>
      <div className="text-white">{telegramInfo?.toString()}</div>
      <WhackAMole />
    </>
  )
}

export default App
