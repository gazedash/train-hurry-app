import SockJS from "sockjs-client";
import xs from "xstream";

export const WS_ENDPOINT = window.LOCAL_WS
? "http://0.0.0.0:9999/echo"
:  "https://train-node-ws.herokuapp.com/echo";

export function createSocket(url) {
  return new SockJS(url ? url : WS_ENDPOINT);
}

export function createWSStream(sock) {
  const producer = {
    start: function(listener) {
      sock.onmessage = function(e) {
        listener.next(e.data);
      };
    },
    stop: function() {
      sock.onmessage = null;
    }
  };
  return xs.create(producer);
}

export const createSocketStream = url => createWSStream(createSocket(url));
// dispatchOnWStream
export const subscribeDeclaratively = stream => {
  return ({ next, error, done }) => {
    stream.subscribe({
      next,
      error,
      done
    });
    return stream;
  };
};

export const createSocketStreamAndSubscribe = (subs = {}, url = null) =>
  subscribeDeclaratively(createSocketStream(url))(subs);
