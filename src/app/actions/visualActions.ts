"use server";

export async function searchVisualAssets(query: string) {
    try {
        const apiKey = process.env.PEXELS_API_KEY;
        if (!apiKey) {
            // Fallback for demo: return a generic high-quality abstract video or related term
            // For example, if it's "python", we can use a generic coding video
            const default_videos = [
                "https://player.vimeo.com/external/371433846.sd.mp4?s=231da7328a96f134907a3c31623910c812165b4c&profile_id=139&oauth2_token_id=57447761",
                "https://player.vimeo.com/external/434045526.sd.mp4?s=c27dc3699b0dc8f47565559cf4010313df2221b2&profile_id=139&oauth2_token_id=57447761",
                "https://player.vimeo.com/external/431185568.sd.mp4?s=694f2910795c4794ed47535b699049755866ef4b&profile_id=139&oauth2_token_id=57447761"
            ];
            return default_videos[Math.floor(Math.random() * default_videos.length)];
        }

        const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: {
                Authorization: apiKey
            }
        });
        const data = await res.json();

        if (data.videos && data.videos.length > 0) {
            // Return the link to the HD/SD file
            const file = data.videos[0].video_files.find((f: any) => f.quality === 'sd' || f.quality === 'hd');
            return file?.link || null;
        }

        return null;
    } catch (e) {
        return null;
    }
}
