import { useContext, useEffect } from "react";
import { ProjectsContext } from "../context/ProjectsContext";

export default function Queue() {
  const { projects, idPlaying, setIdPlaying } = useContext(ProjectsContext)!;

  useEffect(() => {}, [projects, idPlaying]);

  return (
    <aside className="hidden lg:flex lg:flex-col gap-[1.5rem]  bg-[#282828] basis-[10%] md:min-w-[35rem] md:max-w-[35rem] p-[2rem] overflow-auto">
      {Object.entries(projects)
        .reverse()
        .map(([projectId, project]) => (
          <button
            id={`project-${project.title}`}
            key={projectId}
            className="project flex flex-row bg-[#121212] text-white text-[2rem] p-[1.5rem] rounded-[0.5rem] text-start"
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
    </aside>
  );
}
