// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen

///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState, useEffect } from "react";

// import logo from "./assets/logo.svg";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";

// working list by: Manav
import { loveYouGesture } from "./gests/loveyou3000";
import { highFiveGesture } from "./gests/highFive";

///////// Hand poses would be imported here: Swayam
import * as fp from "fingerpose";
import victory from "./assets/victory.png";
import thumbs_up from "./assets/thumbs_up.png";
import ly_3000 from "./assets/ly_3000.png";
// import highFive from "./assets/highFive.png";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [camState, setCamState] = useState("on");
  const [camFace, setCamFace] = useState("environment");

  const videoConstraints = {
    facingMode: camFace
  };

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  // const images = { thumbs_up: thumbs_up, victory: victory };
  const images = {
    // Manav
    thumbs_up: thumbs_up,
    victory: victory,
    i_love_you: ly_3000
    // highFive: highFive
  };
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          // start listing new gestures here: Manav
          loveYouGesture
          // highFiveGesture
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          setEmoji(gesture.gestures[maxConfidence].name);
          console.log(emoji);
        }
      }

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App">
      <div
        className="App-Title"
        style={{
          width: "100vw"
        }}
      >
        inya Naam aavse
      </div>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "80vw",
            height: "80vh"
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "80vw"
            // height: "90vh"
          }}
        />
        {/* NEW STUFF */}
        {emoji !== null ? (
          <img
            src={images[emoji]}
            alt="The reaction"
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              right: "10%",
              top: "10%",
              textAlign: "center",
              height: 100
            }}
          />
        ) : (
          ""
        )}

        {/* NEW STUFF */}
      </header>
      <footer>
        Made with{" "}
        <span role="img" aria-label="sparklingHeart">
          💖
        </span>{" "}
        by BVMites
      </footer>
    </div>
  );
}

export default App;
