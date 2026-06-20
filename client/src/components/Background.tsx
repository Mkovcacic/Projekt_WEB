import { useEffect } from "react";
import "./Background.css";

function Background() {
    useEffect(() => {
    const duration = 16000;

    let start = localStorage.getItem("mesh-animation-start");

    if (!start) {
      start = Date.now().toString();
      localStorage.setItem("mesh-animation-start", start);
    }

    const elapsed = (Date.now() - Number(start)) % duration;

    document.body.style.animationDelay = `-${elapsed}ms`;
  }, []);
}

export default Background;