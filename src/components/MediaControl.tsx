import { useContext, useState } from "react";
import { ProjectsContext } from "../context/ProjectsContext";

import nextIcon from "../assets/icons/next.svg";
import pauseIcon from "../assets/icons/pause.svg";
import previousIcon from "../assets/icons/previous.svg";
import upIcon from "../assets/icons/up.svg";
import downIcon from "../assets/icons/down.svg";

export default function MediaControl() {
  const [isQueueExpanded, setIsQueueExpanded] = useState(false);
  const { projects, idPlaying, setIdPlaying } = useContext(ProjectsContext)!;

  function playPrevious() {
    const projectCount = Object.entries(projects).length;
    if (projectCount === 0) return;

    // If there's only one project, play it.
    if (projectCount === 1) {
      setIdPlaying(0);
      return;
    }
    setIdPlaying((prev) => ((prev ?? 0) + 1) % projectCount);
  }

  function playNext() {
    const projectCount = Object.entries(projects).length;
    if (projectCount === 0) return;

    // If there's only one project, play it.
    if (projectCount === 1) {
      setIdPlaying(0);
      return;
    }

    setIdPlaying((prev) => ((prev ?? 0) - 1 + projectCount) % projectCount);
  }

  function pause() {
    setIdPlaying(null);
  }

  return (
    <nav className="h-[7.5rem]  bg-[#000000] w-[100%] flex flex-row items-center px-[2rem] overflow-hidden">
      {idPlaying !== null && projects[idPlaying] ? (
        <>
          <p className="text-white text-[2rem] flex-1 truncate mr-[1rem]">
            {projects[idPlaying].title}
          </p>
          <button id="play-revious-btn" onClick={playPrevious}>
            <img src={previousIcon} className="h-[3rem] w-[3rem]" />
          </button>
          <button id="pause-btn" onClick={pause}>
            <img src={pauseIcon} className="h-[3rem] w-[3rem] mx-[1rem]" />
          </button>
          <button id="play-next-btn" onClick={playNext}>
            <img src={nextIcon} className="h-[3rem] w-[3rem]" />
          </button>
          <div className="md:hidden flex justify-center">
            {!isQueueExpanded && (
              <button
                id="expand-queue-btn"
                onClick={() => setIsQueueExpanded(true)}
              >
                <img src={upIcon} />
              </button>
            )}
            {isQueueExpanded && (
              <button
                id="hide-queue-btn"
                onClick={() => setIsQueueExpanded(false)}
              >
                <img src={downIcon} />
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-white text-[2rem] flex-1 break-words truncate">
            {idPlaying !== null
              ? "Loading..."
              : "Played project will be displayed here."}
          </p>
          <div className="lg:hidden">
            {!isQueueExpanded && (
              <button
                id="expand-queue-btn"
                onClick={() => setIsQueueExpanded(true)}
              >
                <img src={upIcon} />
              </button>
            )}
            {isQueueExpanded && (
              <button
                id="hide-queue-btn"
                onClick={() => setIsQueueExpanded(false)}
              >
                <img src={downIcon} />
              </button>
            )}
          </div>
        </>
      )}

      <div
        className={`queue-wrapper absolute h-[calc(100%-7.5rem)] z-50 w-[100%] bg-[#282828] p-[2rem] left-0 top-0 lg:hidden ${
          isQueueExpanded ? "flex flex-col gap-[1rem]" : "hidden"
        }`}
      >
        {Object.entries(projects)
          .reverse()
          .map(([projectId, project]) => (
            <button
              id={`project-${project.title}`}
              key={projectId}
              className="project w-[100%] flex flex-row bg-[#121212] text-white text-[2rem] p-[1.5rem] rounded-[0.5rem] text-start"
              style={{
                background:
                  idPlaying === Number(projectId) ? "#fae7ff" : "#121212",
                color: idPlaying === Number(projectId) ? "#282828" : "white",
              }}
              onClick={() => setIdPlaying(Number(projectId))}
            >
              <span className="flex-1 break-all"> {project.title}</span>

              {/* Playing Icon
            {idPlaying === Number(projectId) ? (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#121212"
                >
                  <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" />
                </svg>
              </span>
            ) : (
              // Play Icon
              <span onClick={() => setIdPlaying(Number(projectId))}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
                </svg>
              </span>
            )}
              */}
            </button>
          ))}
      </div>
    </nav>
  );
}
