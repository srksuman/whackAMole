import { useEffect, useState } from "react";
import WhackAMole from "./components/whickAMole.component"
import { retrieveLaunchParams } from '@telegram-apps/sdk';


function App() {
  const [telegramInfo, setTelegramInfo] = useState<unknown>("");
  useEffect(() => {
    (async () => {
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
