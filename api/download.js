const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('YouTube URL is required');
    }

    try {
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        ytdl(url, { filter: 'audioandvideo', quality: 'highest' })
            .pipe(res)
            .on('error', (err) => {
                console.error(`Error: ${err.message}`);
                res.status(500).send('Error downloading video');
            });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Error downloading video');
    }
};
