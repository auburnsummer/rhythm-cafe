import { useContext } from "preact/hooks";
import { MittContext } from "../parts/MittContext/MittContext";


export function useMitt() {
    return useContext(MittContext);
}