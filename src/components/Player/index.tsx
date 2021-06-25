import {useContext, useEffect, useRef, useState} from 'react';
import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        tooglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        toogleLooping,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffle,
        toogleShuffle,
        clearPlayerState
    } = useContext(PlayerContext);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const episode = episodeList[currentEpisodeIndex];

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        }else{
            clearPlayerState();
        }
    }

    return(
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="playing"/>
               <strong>Tocando agora</strong>
           </header>

           { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                    width={592} 
                    height={592} 
                    src={episode.thumbnail} 
                    objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
               ) : (
                <div className={styles.emptyPlayer}>
                    Selecione um podcast para ouvir
                </div>   
            )
           }

           <footer className={!episode ? styles.empty : ''}>
               <div className={styles.progress}>
                    <span>{episode ? convertDurationToTimeString(progress) : "00:00"}</span>
                    <div className={styles.slider}>
                        {
                            episode ? 
                            <Slider
                                onChange = {
                                    handleSeek
                                }
                                trackStyle = { {backgroundColor: '#84d361'} }// barra de progresso
                                railStyle = { {backgroundColor: '#9f75ff'} }// barra de fundo
                                handleStyle = { {borderColor: '#04d361',borderWidth:4} }
                                max={episode.duration}
                                value={progress}
                            />
                            : 
                            <div className={styles.emptySlider}/> 
                        }
                    </div>
                    <span>{episode ? convertDurationToTimeString(episode.duration) : "00:00"}</span>
               </div>
                
                { episode && (
                    <audio 
                    src={episode.url}
                    ref={audioRef}
                    autoPlay
                    loop={isLooping}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onEnded = {handleEpisodeEnded}
                    onLoadedMetadata={setupProgressListener}
                    />
                )}

               <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length == 1} onClick={toogleShuffle} className={isShuffle ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embatalhar"/>
                    </button>
                    {console.log(isShuffle)}
                    
                    <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
                        <img src="/play-previous.svg"  alt="Tocar anterior"/>
                    </button>
                    <button 
                    type="button" 
                    className={styles.playButton} 
                    disabled={!episode} 
                    onClick={tooglePlay}>
                        {
                            isPlaying ?
                             <img src="/pause.svg" alt="Pause" /> 
                             : 
                             <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
                        <img src="/play-next.svg" alt="Tocar Próxima"/>
                    </button>
                    <button type="button" disabled={!episode } className={isLooping ? styles.isActive : ''} onClick={toogleLooping}>
                            <img src="/repeat.svg" alt="Repetir"/>
                    </button>
               </div>
           </footer>
       </div>
    );
}