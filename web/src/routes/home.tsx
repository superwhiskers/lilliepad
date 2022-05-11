import { toggleSearch } from "../Search";

export default function Home() {

  return (
    <>
      <main>
        <h1>
          There is nothing to see here..
        </h1>
        <button onclick={toggleSearch}>View available threads</button>
      </main>
    </>
  )
}