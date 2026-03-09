"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Video, Img } from 'remotion';

export const LessonSlide: React.FC<{
    title: string;
    script: string;
    b_roll_url?: string;
    index: number;
}> = ({ title, script, b_roll_url, index }) => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    // Handheld camera movement (subtle shake)
    const shakeX = Math.sin(frame / 10) * 2;
    const shakeY = Math.cos(frame / 12) * 2;

    const opacity = interpolate(
        frame,
        [0, 5, durationInFrames - 5, durationInFrames], // Snappy fade relative to duration
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = interpolate(
        frame,
        [0, durationInFrames],
        [1.1, 1.3], // More aggressive cinematic push
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Glitch / RGB Split effect on impact
    const glitchTranslate = interpolate(
        frame % 30, // Loop glitch every second
        [0, 2, 4],
        [0, 4, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const translateY = spring({
        frame,
        fps,
        config: { damping: 200 },
    }) * 10 - 10;

    const isVideo = b_roll_url?.includes('.mp4') || b_roll_url?.includes('player.vimeo.com');

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* Cinematic Background Asset with Pro-Color Grading */}
            <AbsoluteFill style={{
                opacity: 0.6,
                transform: `scale(${scale})`,
                filter: 'contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.1)'
            }}>
                {b_roll_url ? (
                    isVideo ? (
                        <Video
                            src={b_roll_url}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            muted
                        />
                    ) : (
                        <Img
                            src={b_roll_url}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #0f172a, #1e293b)' }} />
                )}
            </AbsoluteFill>

            {/* Branding: Lower Third Badge */}
            <div style={{
                position: 'absolute',
                top: '60px',
                left: '60px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: 0.8,
                zIndex: 40
            }}>
                <div style={{
                    height: '40px', width: '40px', background: '#8b5cf6', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 5px 15px rgba(139, 92, 246, 0.5)'
                }}>
                    <div style={{ height: '20px', width: '20px', background: '#fff', borderRadius: '50%' }} />
                </div>
                <span style={{
                    color: '#fff', fontSize: '20px', fontWeight: 900,
                    fontFamily: 'Outfit, system-ui', letterSpacing: '1px'
                }}>
                    LEARN AI STUDIO
                </span>
            </div>

            {/* Film Grain / Noise Texture Overlay */}
            <AbsoluteFill style={{
                opacity: 0.15,
                pointerEvents: 'none',
                background: `url('https://www.transparenttextures.com/patterns/p6.png')`,
                zIndex: 5
            }} />

            {/* Cinematic Vignette & Color Grade */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 10%, rgba(0,0,0,0.9) 110%)',
                zIndex: 10,
                pointerEvents: 'none',
                boxShadow: 'inset 0 0 100px rgba(139, 92, 246, 0.2)'
            }} />

            {/* Letterbox Bars (Cinematic 2.35:1 Look) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10%', background: '#000', zIndex: 100 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10%', background: '#000', zIndex: 100 }} />

            {/* Content Overlay */}
            <AbsoluteFill style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: '100px',
                opacity,
                background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
            }}>
                <div style={{
                    transform: `translate(${shakeX}px, ${translateY + shakeY}px)`,
                    textAlign: 'center',
                    zIndex: 20
                }}>
                    <h1 style={{
                        color: '#fff',
                        fontSize: '110px',
                        fontWeight: 900,
                        marginBottom: '20px',
                        textShadow: '0 0 50px rgba(139, 92, 246, 0.6), 0 10px 40px rgba(0,0,0,0.9)',
                        fontFamily: 'Outfit, system-ui',
                        letterSpacing: '-5px',
                        textTransform: 'uppercase',
                        lineHeight: 0.9
                    }}>
                        {title}
                    </h1>

                    {/* Glowing Accent Line */}
                    <div style={{
                        height: '10px',
                        width: '200px',
                        background: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
                        margin: '0 auto 60px',
                        borderRadius: '5px',
                        boxShadow: '0 0 40px rgba(217, 70, 239, 0.8)'
                    }} />

                    {/* Pro-Captions: Dynamic Word Animation */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '24px',
                        maxWidth: '1600px'
                    }}>
                        {script.split(' ').map((word, i, arr) => {
                            const wordsCount = arr.length;
                            // Scale captions to finish by 90% of duration
                            const startFrame = (i / wordsCount) * (durationInFrames * 0.9);

                            const isCurrentlySpoken = frame >= startFrame && frame < startFrame + 15;

                            const wordOpacity = interpolate(
                                frame,
                                [startFrame, startFrame + 5],
                                [0.1, 1],
                                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                            );
                            const wordScale = interpolate(
                                frame,
                                [startFrame, startFrame + 3, startFrame + 5],
                                [0.4, 1.4, 1],
                                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                            );

                            const isPowerWord = word.length > 7 || word.includes('!') || i % 6 === 0;

                            return (
                                <span
                                    key={i}
                                    style={{
                                        color: wordOpacity > 0.9
                                            ? (isPowerWord ? '#facc15' : '#fff')
                                            : 'rgba(255,255,255,0.15)',
                                        fontSize: isPowerWord ? '76px' : '68px',
                                        fontWeight: 900,
                                        fontFamily: 'Outfit, system-ui',
                                        transform: `scale(${wordScale}) translateY(${isCurrentlySpoken ? -10 : 0}px)`,
                                        textShadow: wordOpacity > 0.9
                                            ? `0 0 40px ${isPowerWord ? 'rgba(250, 204, 21, 0.6)' : 'rgba(139, 92, 246, 0.5)'}`
                                            : 'none',
                                        transition: 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        filter: isCurrentlySpoken ? `drop-shadow(${glitchTranslate}px 0 rgba(255,0,0,0.5)) drop-shadow(-${glitchTranslate}px 0 rgba(0,255,255,0.5))` : 'none'
                                    }}
                                >
                                    {word}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Lesson Progress Bar */}
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
                    height: '15px',
                    background: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)',
                    zIndex: 100
                }} />

                {/* Glassmorphic Slide Number */}
                <div style={{
                    position: 'absolute',
                    bottom: '60px',
                    left: '60px',
                    color: '#fff',
                    fontSize: '22px',
                    fontWeight: 900,
                    opacity: 0.9,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(15px)',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'Outfit, system-ui',
                    letterSpacing: '2px',
                    zIndex: 30
                }}>
                    MOD {index + 1}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
