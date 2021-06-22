import { createContext, useState, ReactNode } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episodes: Episode) => void;
    tooglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsplaying] = useState(false);

    function play(episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsplaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsplaying(true);
    }

    function tooglePlay() {
        setIsplaying(!isPlaying);
    }

    function setPlayingState(state: boolean) {
        setIsplaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;

    const hasNext = (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {
        const nextEpisodeIndex = currentEpisodeIndex + 1;

        if (hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        const previousEpisodeIndex = currentEpisodeIndex -1;

        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex-1);
        }
    }

    return (
        <PlayerContext.Provider value={
            { episodeList,
             currentEpisodeIndex,
             play,
             isPlaying,
             tooglePlay,
             setPlayingState,
             playList,
             playNext,
             playPrevious,
             hasNext,
             hasPrevious }
        }>
            {children}
        </PlayerContext.Provider>
    )
}