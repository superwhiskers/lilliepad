import "./App.scss";
import { Component, createEffect, createMemo, createSignal, For, JSX, Show } from "solid-js";
import { Message } from "./components/Message";
import { Tab } from "./components/Tab";
import { Icon } from "./components/Icon";
import { createThrottle } from "./utils";
import { useRevolt } from "./state/revolt";
import { TextChannel } from "./revolt/api/types/channels";
import { Route, Routes, useParams } from "solid-app-router";
import { toggleSearch } from "./Search";

import Thread from "./routes/thread/[id]";

export const App: Component = () => {
  const revolt = useRevolt()

  return (
    <div className="App">
      <header>
        <button class="icon search" title="Search" onClick={toggleSearch}>
          <Icon name="plant-2" size="1.25rem" />
        </button>
        <nav class="tabs">
          <Routes>
            <Route path="/thread/:id" element={() => {
              const params = useParams<{ id: string }>()
              const channelId = params.id;

              const channel = (revolt.state.channels[channelId] as TextChannel)
              const server = (revolt.state.servers[channel.server])

              return <Tab name={`revolt:${server.name}/${channel.name}`} service='telegram' />;
            }} />
          </Routes>
        </nav>
      </header>
      <Routes>
        <Route path="/thread/:id" element={<Thread />} />
      </Routes>
    </div>
  )
}

