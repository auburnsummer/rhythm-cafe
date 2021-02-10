import { useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { LSState } from "../utils/enums.js";
import ky from "https://cdn.skypack.dev/ky";
import decompress from "https:/cdn.skypack.dev/brotli/decompress";
import {Buffer} from "https://cdn.skypack.dev/buffer";
import { DB_URL } from "../utils/constants.js";
import { nanoid } from "https://cdn.skypack.dev/nanoid";

// wrap the worker in a promise.
function workerWrapper(worker) {
	const messageMap = {};
	// When we receive a message...
	const recv = (message) => {
		const {id, ...rest} = message.data;
		// Check if it's in the message map, and invoke the appropriate function.
		if (id in messageMap) {
			(rest.error ? messageMap[id].reject : messageMap[id].resolve)(rest);
			delete messageMap[id];
		} else {
			// this shouldn't happen.
			console.log("We received a message we didn't know about!");
			console.log({id, ...rest});
		}
	}
	const send = ({...config}) => {
		return new Promise((resolve, reject) => {
			// Get a unique id for this message.
			const id = nanoid();
			// Put the promise functions in the map (recv will call it)
			messageMap[id] = {resolve, reject};
			const payload = {id, ...config};
			console.log(payload);
			worker.postMessage(payload);
		})
	}

	return {send, recv};
}

export function useSqlWorker() {
	// Service worker states.
	const [worker, setWorker] = useState(null);
	const [workerError, setWorkerError] = useState(null);
	const [workerState, setWorkerState] = useState(LSState.LoadingWorker);

	const [dbDownloadProgress, setDbDownloadProgress] = useState(0);
	const [compressedDb, setCompressedDb] = useState(null);
	const [dbBuffer, setDBBuffer] = useState(null);
	
	useEffect(() => {
		// Move through the state machine.
		try {
			// Load the worker.
			if (workerState === LSState.LoadingWorker) {
				const worker = new Worker("./js/lib/worker.sql-wasm.js");
				const wrapper = workerWrapper(worker);
				worker.onmessage = wrapper.recv;
				setWorker(wrapper);
				window.sqlTest = wrapper;

				// setWorker(worker);
				setWorkerState(LSState.SyncingDatabase);
			}
			// Load the database. For now, just download it.
			// In the future, we might make this more efficient, e.g.
			// https://docs.itch.ovh/wharf/master/
			if (workerState === LSState.SyncingDatabase) {
				ky.get(
					DB_URL,
					{
						onDownloadProgress: ({percent}) => setDbDownloadProgress(percent)
					}
				)
				.then(resp => {
					return resp.arrayBuffer();
				})
				.then(buf => {
					try {
						// DEBUGGING CODE for testing
						function bufferToHex(buffer) {
							var s = '', h = '0123456789abcdef';
							(new Uint8Array(buffer)).forEach((v) => { s += h[v >> 4] + h[v & 15]; });
							return s;
						}						
						console.log("SHA1 of current db:");
						crypto.subtle.digest("SHA-1", buf).then(bufferToHex).then(console.log);
					} catch (err) {
						// If crypto.subtle.digest isn't supported, whatever
					}
					setCompressedDb(buf);
					setWorkerState(LSState.DecompressingDatabase);
				});
			}
			// Decompress the database (Brotli).
			if (workerState === LSState.DecompressingDatabase) {
				const decompressed = decompress(Buffer.from(compressedDb))
				setDBBuffer(decompressed);
				setCompressedDb(null); // garbage collect, we don't need this buffer now.
				// todo: can we decompress in place? right now this takes 2x memory
				setWorkerState(LSState.InitialisingSqlJs);
			}
			// Send the buffer to sql.js
			if (workerState === LSState.InitialisingSqlJs) {
				worker.send({
					action: 'open',
					buffer: dbBuffer
				})
				.then(() => {
					setWorkerState(LSState.Loaded);
				})
			}
		} catch (err) {
			console.log("Error!");
			console.log(err);
			setWorkerError(err);
			setWorkerState(LSState.Error);
		}
    }, [workerState]);
    
    return {worker, workerState, dbDownloadProgress, workerError}

}