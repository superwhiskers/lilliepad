import { createResource } from "solid-js"
import { Component, createContext, useContext } from "solid-js"
import { TOKEN } from "../revolt/api/common"
import * as Revolt from "../revolt/client"

const RevoltClientContext = createContext<Revolt.Client>()

export const RevoltClientProvider: Component = (props) => {
  const client = new Revolt.Client({ debug: true })
  
  createResource(async () => {
    await client.connect()
    await client.authenticate(TOKEN)
  })

  return (
    <RevoltClientContext.Provider value={client}>
      {props.children}
    </RevoltClientContext.Provider>
  )
}

export const useRevolt = () => useContext(RevoltClientContext)!
