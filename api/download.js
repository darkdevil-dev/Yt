const { exec } = require('child_process');
const util = require('util');

// Promisify exec to use with async/await
const execPromise = util.promisify(exec);

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('YouTube URL is required');
    }

    // Command to download video using yt-dlp
    const command = `yt-dlp -o - ${url}`;
    try {
        const { stdout, stderr } = await execPromise(command, { encoding: 'binary' });
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send('Error downloading video');
        }
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');
        res.send(stdout);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Error downloading video');
    }
};
