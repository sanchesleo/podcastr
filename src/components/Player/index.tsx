import {useContext} from 'react';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';

export function Player(){
    const player = useContext(PlayerContext);

    return(
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="playing"/>
               <strong>Tocando agora {player}</strong>
           </header>

           <div className={styles.emptyPlayer}>
                Selecione um podcast para ouvir
           </div>

           <footer className={styles.empty}>
               <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        <div className={styles.emptySlider}/>
                    </div>
                    <span>00:00</span>
               </div>

               <div className={styles.buttons}>
                    <button type="button">
                        <img src="/shuffle.svg" alt="Embatalhar"/>
                    </button>
                    <button type="button">
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton}>
                        <img src="/play.svg" alt="Tocar"/>
                    </button>
                    <button type="button">
                        <img src="/play-next.svg" alt="Tocar Próxima"/>
                    </button>
                    <button type="button">
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
               </div>
           </footer>
       </div>
    );
}