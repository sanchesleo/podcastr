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
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffle;
    play: (episodes: Episode) => void;
    tooglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toogleLooping: () => void;
    toogleShuffle: () => void;
    clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsplaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

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

    function toogleLooping() {
        setIsLooping(!isLooping);
        setIsShuffle(false);
    }

    function toogleShuffle() {
        setIsShuffle(!isShuffle);
        setIsLooping(false);
    }

    function setPlayingState(state: boolean) {
        setIsplaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;

    const hasNext = isShuffle || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {
        if (isShuffle) {
            const nextRandomEpisodeIndex = (Math.floor(Math.random()*episodeList.length) )
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if (hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        const previousEpisodeIndex = currentEpisodeIndex -1;

        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex-1);
        }
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
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
             hasPrevious,
             toogleLooping,
             isLooping,
             isShuffle,
             toogleShuffle,
             clearPlayerState }
        }>
            {children}
        </PlayerContext.Provider>
    )
}