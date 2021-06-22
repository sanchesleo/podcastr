
import {GetStaticProps} from 'next';
import Image from 'next/image';
import Link  from 'next/link'; // Reponsável por não ter que recarregar a aplicação toda vez

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

import {PlayerContext} from '../contexts/PlayerContext';
import {useContext} from 'react';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
  //...
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  // console.log(props.episodes);
  //O valor será exibido no server node do next e não do browser.
  const {playList} = useContext(PlayerContext);
  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {
          latestEpisodes.map((episode, index) => {
            return(
              <li key={episode.id}>
                <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover"/>

                <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick= {() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })
          }
        </ul>
      </section>
     
     <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>  
            <tbody>
              {
                allEpisodes.map( (episode,index) => {
                  return(
                    <tr key={episode.id}>
                      <td style={{width:72}}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                      </td>
                      <td>
                        <Link href={`/episodes/${episode.id}`}>
                          <a>{episode.title}</a>
                        </Link>
                      </td>
                      <td>
                        {episode.members}
                      </td>
                      <td style={{width:100}}>
                        {episode.publishedAt}
                      </td>
                      <td>
                        {episode.durationAsString}
                      </td>
                      <td>
                        <button type="button" onClick={() => playList(episodeList,index + latestEpisodes.length)}>
                          <img src="/play-green.svg" alt="Tocar episódio"/>
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
     </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => { 
   const {data} = await api.get('episodes', {
     params: {
       _limit: 12,
       _sort: 'published_at',
       _order: 'desc'
     }
   });

   const episodes = data.map( episode => {
      return{
        id: episode.id,
        title: episode.title,
        members: episode.members,
        thumbnail: episode.thumbnail,
        publishedAt: format(parseISO(episode.published_at),'d MMM yy', {locale: ptBR}),
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        description: episode.description,
        url: episode.file.url,
      }
   })

   const latestEpisodes = episodes.slice(0,2);
   const allEpisodes = episodes.slice(2,episodes.length);

   return{
     props: {
      latestEpisodes,
      allEpisodes
     },
     revalidate: 60*60*8,
     // Roda nossa aplicação de 8 em oito horas deixando o site performatico
   }
}
