// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

//ÒôÀÖ²¥·Å

// import React from 'react';
// import ReactAplayer from 'react-aplayer';

// export default class App extends React.Component {
//   // event binding example
//   onPlay = () => {
//     console.log('on play');
//   };

//   onPause = () => {
//     console.log('on pause');
//   };

//   // example of access aplayer instance
//   onInit = ap => {
//     this.ap = ap;
//   };

//   render() {
//     const props = {
//       theme: '#F57F17',
//       lrcType: 3,
//       audio: [
//         {
//           name: '¹â¤ë¤Ê¤é',
//           artist: 'Goose house',
//           url: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.mp3',
//           cover: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.jpg',
//           lrc: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.lrc',
//           theme: '#ebd0c2'
//         }
//       ]
//     };

//     return (
//       <div>
//         <ReactAplayer
//           {...props}
//           onInit={this.onInit}
//           onPlay={this.onPlay}
//           onPause={this.onPause}
//         />
//         {/* example of access aplayer instance API */}
//         <button onClick={() => this.ap.toggle()}>toggle</button>
//       </div>
//     );
//   }
// }

import "./App.css";
import ReactPlayer from "react-player";
import { Container } from "@material-ui/core";
import Control from "./Components/Control";
import { useState, useRef } from "react";
import { formatTime } from "./format";

let count = 0;
function App() {
  const videoPlayerRef = useRef(null);
  const controlRef = useRef(null);

  const [videoState, setVideoState] = useState({
    playing: false,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    buffer: true,
  });

  //Destructuring the properties from the videoState
  const { playing, muted, volume, playbackRate, played, seeking, buffer } =
    videoState;

  const currentTime = videoPlayerRef.current
    ? videoPlayerRef.current.getCurrentTime()
    : "00:00";
  const duration = videoPlayerRef.current
    ? videoPlayerRef.current.getDuration()
    : "00:00";

  const formatCurrentTime = formatTime(currentTime);
  const formatDuration = formatTime(duration);

  const playPauseHandler = () => {
    //plays and pause the video (toggling)
    setVideoState({ ...videoState, playing: !videoState.playing });
  };

  const rewindHandler = () => {
    //Rewinds the video player reducing 5
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() - 5);
  };

  const handleFastFoward = () => {
    //FastFowards the video player by adding 10
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() + 10);
  };

  //console.log("========", (controlRef.current.style.visibility = "false"));
  const progressHandler = (state) => {
    if (count >= 0) {
      console.log("close");
      controlRef.current.style.visibility = "hidden"; // toggling player control container
    } else if (controlRef.current.style.visibility === "visible") {
      count += 1;
    }

    if (!seeking) {
      setVideoState({ ...videoState, ...state });
    }
  };

  const seekHandler = (e, value) => {
    setVideoState({ ...videoState, played: parseFloat(value / 100) });
    videoPlayerRef.current.seekTo(parseFloat(value / 100));
  };

  const seekMouseUpHandler = (e, value) => {
    console.log(value);

    setVideoState({ ...videoState, seeking: false });
    videoPlayerRef.current.seekTo(value / 100);
  };

  const volumeChangeHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
    });
  };

  const volumeSeekUpHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: newVolume === 0 ? true : false,
    });
  };

  const muteHandler = () => {
    //Mutes the video player
    setVideoState({ ...videoState, muted: !videoState.muted });
  };

  const onSeekMouseDownHandler = (e) => {
    setVideoState({ ...videoState, seeking: true });
  };

  const mouseMoveHandler = () => {
    controlRef.current.style.visibility = "visible";
    count = 0;
  };

  const bufferStartHandler = () => {
    console.log("Bufering.......");
    setVideoState({ ...videoState, buffer: true });
  };

  const bufferEndHandler = () => {
    console.log("buffering stoped ,,,,,,play");
    setVideoState({ ...videoState, buffer: false });
  };

  
  return (
    <div className="video_container">
      <div>
        <h2>Droite</h2>
        {/* 2024.02.03 */}
      </div>
      <Container maxWidth="md" justify="center">
        <div className="player__wrapper" onMouseMove={mouseMoveHandler}>
          <ReactPlayer
            ref={videoPlayerRef}
            className="player"
            url="https://vjs.zencdn.net/v/oceans.mp4"
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={progressHandler}
            onBuffer={bufferStartHandler}
            onBufferEnd={bufferEndHandler}
          />

          {/* {buffer && <p>Loading</p>} */}

          <Control
            controlRef={controlRef}
            onPlayPause={playPauseHandler}
            playing={playing}
            onRewind={rewindHandler}
            onForward={handleFastFoward}
            played={played}
            onSeek={seekHandler}
            onSeekMouseUp={seekMouseUpHandler}
            volume={volume}
            onVolumeChangeHandler={volumeChangeHandler}
            onVolumeSeekUp={volumeSeekUpHandler}
            mute={muted}
            onMute={muteHandler}
            playRate={playbackRate}
            duration={formatDuration}
            currentTime={formatCurrentTime}
            onMouseSeekDown={onSeekMouseDownHandler}
          />
        </div>
      </Container>
    </div>
  );
}

export default App;
