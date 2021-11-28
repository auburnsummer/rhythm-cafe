import mitt from 'mitt';
import { MittContext } from './MittContext';

export function MittContextFactory({children}) {
    const emitter = mitt();

    return (
        <MittContext.Provider value={emitter}>
            {children}
        </MittContext.Provider>
    )
}