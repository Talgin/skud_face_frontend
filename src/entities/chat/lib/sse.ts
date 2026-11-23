// Incremental parser for a text/event-stream body read with fetch():
// EventSource cannot POST or send an Authorization header.

export function createSseParser(onData: (data: string) => void) {
  let buffer = "";
  return (chunk: string) => {
    buffer += chunk.replace(/\r\n/g, "\n");
    let sep = buffer.indexOf("\n\n");
    while (sep !== -1) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const data = raw
        .split("\n")
        .filter((l) => l.startsWith("data:"))
        .map((l) => l.slice(5).replace(/^ /, ""))
        .join("\n");
      if (data) onData(data);
      sep = buffer.indexOf("\n\n");
    }
  };
}
