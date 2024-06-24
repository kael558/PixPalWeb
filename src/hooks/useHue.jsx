import { createContext, useContext } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";

const HueContext = createContext();

export const HueProvider = ({ children }) => {
    const [hue, setHue] = useLocalStorage("hue", "#871F78"); 
   
    // #FFA345 - orange

    const getRGB = () => {
        const h = parseInt(hue.replace("#", ""), 16);
        const r = (h >> 16) & 0xff;
        const g = (h >> 8) & 0xff;
        const b = h & 0xff;

        return { r, g, b };
    };

    const getRGBStr = () => {
        const rgb = getRGB();
        return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    };

    return <HueContext.Provider value={{ hue, setHue, getRGB, getRGBStr }}>{children}</HueContext.Provider>;
}


export const useHue = () => {
    return useContext(HueContext);
};