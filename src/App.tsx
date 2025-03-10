import { ProjectsProvider } from "./context/ProjectsContext";

import Xpad from "./components/XPad";
import Queue from "./components/Queue";
import MediaControl from "./components/MediaControl";

export default function App() {
  return (
    <ProjectsProvider>
      <div
        className="flex flex-col w-[100vw] h-[100svh]  relative min-h-[50rem]"
        id="drum-machine"
      >
        <div className="flex-1 flex flex-col h-[calc(100%-6rem)] md:flex-row ">
          <Xpad />
          <Queue />
        </div>
        <MediaControl />
      </div>
    </ProjectsProvider>
  );
}
