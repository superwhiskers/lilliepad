const ERROR_URL = "https://reporting.revolt.chat";

export interface StackFrame {
  functionName?: string,
  columnNumber: number,
  fileName: string,
  lineNumber: number
}

export interface ErrorReport {
  origin: string,
  section: "client" | "renderer" | string,
  userAgent: string
  commitSHA: string,
  rawStackTrace: string,
  stackframes: StackFrame[]
}

export function reportError(error: Error, section: ErrorReport['section']) {
  return fetch(ERROR_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      stackframes: [],
      rawStackTrace: error.stack,
      origin: location.origin,
      commitSHA: '147880a447cd6b79a2dd6b0d1cd7d4b5fd90bee8',
      userAgent: navigator.userAgent,
      "": navigator.userAgent,
      section,
    })
  })
}

// 147880a447cd6b79a2dd6b0d1cd7d4b5fd90bee8
// Array.from(crypto.getRandomValues(new Uint8Array(20)), e => e.toString(16).padStart(2, "0")).join("")