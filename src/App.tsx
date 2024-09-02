import { useEffect, useState } from "react";
import WhackAMole from "./components/whickAMole.component"
import { retrieveLaunchParams } from '@telegram-apps/sdk';


function App() {
  const [telegraminfo, setTelegraminfo] = useState(null);
  useEffect(() => {
    (async () => {
      console.log({ retrieveLaunchParams })
      setTelegraminfo(retrieveLaunchParams);
    })();
  }, [])

  return (
    <>
      <div className="text-white">{telegraminfo.toString()}</div>
      <WhackAMole />
    </>
  )
}

export default App
