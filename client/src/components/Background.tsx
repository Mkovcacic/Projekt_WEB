import { useEffect } from "react";
import "./Background.css";

function Background() {
    useEffect(() => {
    const duration = 36000
    const storage_key = 'mesh-animation-start'
    
    let start = localStorage.getItem(storage_key)

    if (!start) {
      start = Date.now().toString();
      localStorage.setItem(storage_key, start)
    }

    const elapsed = (Date.now() - Number(start)) % duration

    document.body.style.animationDelay = `-${elapsed}ms`
  }, [])
  return null
}

export default Background