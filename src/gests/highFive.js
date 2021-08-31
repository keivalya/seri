// Import dependencies
import { Finger, FingerCurl, FingerDirection } from "fingerpose";
import GestureDescription from "../../fingerpose/src/GestureDescription.js";

// Define Gesture Description
export const highFiveGesture = new GestureDescription("high_five");

// Thumb
highFiveGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
highFiveGesture.addDirection(
  Finger.Thumb,
  FingerDirection.HorizontalLeft,
  0.25
);
highFiveGesture.addDirection(
  Finger.Thumb,
  FingerDirection.HorizontalRight,
  0.25
);

for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  highFiveGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  highFiveGesture.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
  highFiveGesture.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
}
