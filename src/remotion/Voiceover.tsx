"use client";

import { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const Voiceover: React.FC<{
    text: string;
    voiceName?: string;
}> = ({ text, voiceName = "Google US English" }) => {
    const frame = useCurrentFrame();

    useEffect(() => {
        // We only trigger speech at the very start of the sequence (frame 0)
        if (frame === 0 && typeof window !== 'undefined' && window.speechSynthesis) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Try to find a high-quality voice
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.name.includes(voiceName)) || voices[0];

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            window.speechSynthesis.speak(utterance);
        }

        // Cleanup: stop speaking if component unmounts or slide changes
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                // window.speechSynthesis.cancel(); 
                // We don't cancel here because it might cut off the end of a sentence 
                // if there's a slight timing drift. 
                // But we do cancel at the START of the next slide (above).
            }
        };
    }, [frame, text, voiceName]);

    return null; // This is a logic-only component
};
