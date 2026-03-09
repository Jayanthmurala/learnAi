"use client";

import { Series, Audio } from 'remotion';
import { LessonSlide } from './LessonSlide';
import { Voiceover } from './Voiceover';

export interface CourseVideoProps {
    lessons: {
        title: string;
        script: string;
        b_roll_url?: string;
    }[];
    voiceName?: string;
}

export const CourseVideo: React.FC<CourseVideoProps> = ({ lessons, voiceName }) => {
    // Dynamic duration based on script length to ensure narration doesn't cut off
    return (
        <>
            {/* Cinematic Background Music (Lo-fi / Ambient) */}
            <Audio
                src="https://p.nomadlist.com/audio/lo-fi-1.mp3"
                volume={0.15} // Keep it low so voice is clear
                loop
            />

            <Series>
                {lessons.map((lesson, i) => {
                    // Estimate duration: 30fps * (words / 2.5 per sec) + 60 frames buffer
                    const words = lesson.script.split(' ').length;
                    const SLIDE_DURATION = Math.max(120, Math.ceil((words / 2.5) * 30) + 60);

                    return (
                        <Series.Sequence key={i} durationInFrames={SLIDE_DURATION}>
                            <Voiceover text={lesson.script} voiceName={voiceName} />
                            <LessonSlide
                                title={lesson.title}
                                script={lesson.script}
                                b_roll_url={lesson.b_roll_url}
                                index={i}
                            />
                        </Series.Sequence>
                    );
                })}
            </Series>
        </>
    );
};
