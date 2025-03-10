import { useContext, useEffect, useRef, useState } from "react";
import { ProjectsContext } from "../context/ProjectsContext";

const keys = [
  "1",
  "2",
  "3",
  "4",
  "Q",
  "W",
  "E",
  "R",
  "A",
  "S",
  "D",
  "F",
  "Z",
  "X",
  "C",
  "V",
];

const drumsAudio = [
  "clap_01.mp3",
  "clap_02.mp3",
  "clap_03.mp3",
  "clap_04.mp3",
  "heater_01.mp3",
  "heater_02.mp3",
  "heater_03.mp3",
  "heater_04.mp3",
  "hihat_01.mp3",
  "hihat_02.mp3",
  "hihat_03.mp3",
  "hihat_04.mp3",
  "kick_01.mp3",
  "kick_02.mp3",
  "kick_03.mp3",
  "kick_04.mp3",
];

export default function Xpad() {
  const [keyClicked, setKeyClicked] = useState<string | null>("");
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);
  const { setProjects } = useContext(ProjectsContext)!;

  interface ProjectProps {
    title: string;
    audioHrefs: string[] | [];
    audioTitles: string[] | [];
  }

  const [playingIndex, setPlayingIndex] = useState<null | number>(null);
  const [project, setProject] = useState<ProjectProps>({
    title: "",
    audioHrefs: [],
    audioTitles: [],
  });

  const projectTilesRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Refs for handling the playProject timeouts and audio objects.
  const playTimeoutsRef = useRef<number[]>([]);
  const playingAudiosRef = useRef<HTMLAudioElement[]>([]);

  const addKey = (index: number) => {
    const audioEl = audioRefs.current[index];
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play();
    }

    // Remove file extension, replace dashes/underscores globally, and remove "0"
    const currentClick = drumsAudio[index]
      .slice(0, -4)
      .replace(/[-_]/g, " ")
      .replace("0", "");
    const formatted =
      currentClick.charAt(0).toUpperCase() + currentClick.slice(1);

    setProject((prev) => ({
      ...prev,
      title: prev.title,
      audioHrefs: [...prev.audioHrefs, drumsAudio[index]],
      audioTitles: [...prev.audioTitles, formatted],
    }));
  };

  function activateKeyClick(key: string) {
    setKeyClicked(key);
    setTimeout(() => {
      setKeyClicked(null);
    }, 250);
  }

  // Handle key down events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if the active element is an input or textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const keyPressed = e.key.toUpperCase();

      // Prevent further action if the key is already pressed
      if (isKeyPressed) {
        e.preventDefault();
        return;
      }

      // Set the flag to true indicating the key has been pressed
      setIsKeyPressed(true);

      // Call the functions to activate key click and add key
      activateKeyClick(keyPressed);
      e.preventDefault();

      const index = keys.indexOf(keyPressed);
      if (index !== -1) {
        addKey(index);
      }
    };

    const handleKeyUp = () => {
      setIsKeyPressed(false);
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      // Cleanup event listeners
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isKeyPressed]);

  // Function to stop current playback: clears scheduled timeouts and stops audio
  function stopPlaying() {
    // Clear scheduled timeouts
    playTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    playTimeoutsRef.current = [];

    // Pause and reset any currently playing audio objects
    playingAudiosRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    playingAudiosRef.current = [];

    setPlayingIndex(null);
  }

  // Play the project audio sequence and scroll to corresponding project tile
  function playProject() {
    // Stop any previous playback before starting
    stopPlaying();

    project.audioHrefs.forEach((href, index) => {
      const timeoutId = window.setTimeout(() => {
        projectTilesRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setPlayingIndex(index);

        const audio = new Audio(`/drum_audios/${href}`);
        audio.play();
        playingAudiosRef.current.push(audio);
        if (index === project.audioHrefs.length - 1)
          audio.onended = () => setPlayingIndex(null);
      }, index * 250);
      playTimeoutsRef.current.push(timeoutId);
    });
  }

  // Add the current project to projects and stop any ongoing playback
  function addProject() {
    if (!project.title) {
      alert("Please enter a project name.");
      return;
    }

    if (project.audioHrefs.length < 1) {
      alert("Project should have at least one key audio.");
      return;
    }

    // Stop project playback if it's ongoing
    stopPlaying();

    setProjects((prev) => {
      const newId =
        prev && Object.keys(prev).length
          ? Math.max(...Object.keys(prev).map(Number)) + 1
          : 0;
      return { ...prev, [newId]: project };
    });

    setProject({ title: "", audioHrefs: [], audioTitles: [] });
  }

  return (
    <section className="flex-1 flex flex-col-reverse max-w-full bg-[#121212] p-[2.5rem] gap-[2rem] md:p-[3rem] md:gap-[3rem] xl:flex-row overflow-hidden">
      <div className="xpad bg-[#282828] grid grid-cols-4 grid-rows-4 flex-1 p-[2rem] gap-[1.5rem] md:p-[3rem]  md:gap-[3rem] ">
        {keys.map((key, index) => (
          <button
            key={key}
            id={drumsAudio[index].slice(0, -4)}
            className="drum-pad bg-fuchsia-100 text-[2rem] font-bold md:text-[3rem]"
            style={{
              background: keyClicked === key ? "#121212" : "#fae7ff",
              color: keyClicked === key ? "white" : "#121212",
            }}
            onClick={() => {
              addKey(index);
              activateKeyClick(key);
            }}
          >
            {key}
            <audio
              hidden
              ref={(el) => {
                if (el) {
                  audioRefs.current[index] = el;
                }
              }}
              id={key}
              className="clip"
              src={`/drum_audios/${drumsAudio[index]}`}
            />
          </button>
        ))}
      </div>
      <div id="display" className=" xl:basis-[30%]">
        <div className="w-[100%] flex flex-col gap-[1rem] md:flex-row">
          <input
            value={project.title ? project.title : ""}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="Enter project name"
            className="text-[2rem] flex-1 text-white outline-none border-1 rounded-lg py-[0.5rem] px-[1rem]"
          ></input>
          <div className="w-[100%] flex flex-row gap-[1rem] md:w-auto ">
            <button
              id="play-project-btn"
              className="flex-1 text-[2rem] bg-[#282828] border-1 border-[#282828] text-[#ffff] py-[0.5rem] px-[1.5rem] 
             rounded-lg hover:border-[#121212]"
              onClick={() => playProject()}
            >
              Play
            </button>

            <button
              id="add-project-btn"
              className="flex-1 text-[2rem] bg-[#fae7ff] text-[#121212] border-1 border-[#fae7ff] py-[0.5rem] px-[1.5rem] rounded-lg  hover:border-[#282828]"
              onClick={() => addProject()}
            >
              Add
            </button>
          </div>
        </div>

        <div
          className={`click-history  rounded-lg flex flex-row overflow-auto bg-[#282828] mt-[2rem] max-h-[calc(100svh-20rem)] gap-[1rem] py-[1rem] px-[1.5rem] 
        md:flex md:flex-row xl:flex xl:flex-col xl:gap-[1.5rem]  ${
          project.audioTitles.length > 0
            ? "2xl:grid 2xl:grid-cols-3 2xl:p-[1.5rem]"
            : ""
        }`}
        >
          {project.audioTitles.length < 1 ? (
            <p className="text-white text-[2rem] py-[0.5rem] px-[1rem]">
              Try to press the pad.
            </p>
          ) : (
            project.audioTitles.map((title, index) => (
              <button
                id={`key-${index + 1}`}
                ref={(el) => {
                  projectTilesRefs.current[index] = el;
                }}
                style={{
                  background: playingIndex === index ? "#121212" : "#fae7ff",
                  color: playingIndex === index ? "white" : "#282828",
                }}
                key={index}
                className="text-[#121212] text-[2rem] flex-shrink-0 scroll-mt-[15rem] py-[0.5rem] px-[1rem] rounded-lg 2xl:p-[3rem] 2xl:text-center "
              >
                {title}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
