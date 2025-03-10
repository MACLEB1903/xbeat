import React, { createContext, useState, ReactNode, useEffect } from "react";

type ProjectContextType = {
  title: string;
  audioHrefs: string[];
  audioTitles: string[];
};

type ProjectsType = {
  idPlaying: number | null;
  projects: { [id: number]: ProjectContextType };
  setProjects: React.Dispatch<
    React.SetStateAction<{ [id: number]: ProjectContextType }>
  >;
  setIdPlaying: React.Dispatch<React.SetStateAction<number | null>>;
};

export const ProjectsContext = createContext<ProjectsType | undefined>(
  undefined
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<{
    [id: number]: ProjectContextType;
  }>({});

  const [idPlaying, setIdPlaying] = useState<number | null>(null);

  useEffect(() => {
    if (idPlaying === null || !projects[idPlaying]) {
      return;
    }

    const { audioHrefs } = projects[idPlaying];

    const audioElements: HTMLAudioElement[] = [];
    const timeouts: number[] = [];

    audioHrefs.forEach((href, index) => {
      const timeoutId = setTimeout(() => {
        const audio = new Audio(`/drum_audios/${href}`);

        audio.play();
        audioElements.push(audio);
      }, index * 250);

      timeouts.push(timeoutId);
    });

    return () => {
      // Stop all playing audio
      audioElements.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      // Clear all pending timeouts
      timeouts.forEach(clearTimeout);
    };
  }, [idPlaying]);

  return (
    <ProjectsContext.Provider
      value={{ projects, setProjects, idPlaying, setIdPlaying }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
