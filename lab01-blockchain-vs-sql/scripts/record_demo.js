const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function record() {
  const framesDir = path.join(__dirname, 'frames');
  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--window-size=1100,760'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 760, deviceScaleFactor: 1 });

  const demoUrl = 'file:///' + path.resolve(__dirname, '../demo/index.html').replace(/\\/g, '/');
  console.log('Navigating to:', demoUrl);
  await page.goto(demoUrl, { waitUntil: 'networkidle0' });

  const client = await page.target().createCDPSession();
  let frameIndex = 0;
  let isRecording = true;

  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    if (!isRecording) return;
    const filename = path.join(framesDir, `frame_${String(frameIndex++).padStart(5, '0')}.jpg`);
    fs.writeFileSync(filename, Buffer.from(data, 'base64'));
    try {
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {}
  });

  console.log('Starting screencast...');
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 88,
    everyNthFrame: 1
  });

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // Step 1: Initial view (0.8s)
  await sleep(800);

  // Step 2: Race Comparison (SQL rushes 0.82ms, P2P radiates waves 1420ms)
  console.log('Triggering Race Comparison...');
  await page.evaluate(() => startRaceSimulation());
  await sleep(2200);

  // Step 3: DBA Tamper SQL (Raw overwrite into DB memory)
  console.log('Triggering DBA Tamper...');
  await page.evaluate(() => toggleDbaTamperSql());
  await sleep(2000);

  // Step 4: Tamper Blockchain (Poison Block #1, Quorum Rejects)
  console.log('Triggering Tamper Blockchain...');
  await page.evaluate(() => toggleTamperBlockchain());
  await sleep(2200);

  // Step 5: Restore Consensus (Emerald Green Wave from Validators)
  console.log('Triggering Restore Consensus...');
  await page.evaluate(() => toggleTamperBlockchain());
  await sleep(2000);

  // Finish recording
  console.log(`Captured ${frameIndex} frames. Stopping screencast...`);
  isRecording = false;
  await client.send('Page.stopScreencast');
  await browser.close();

  // Step 6: Encode with ffmpeg
  const assetsDir = path.resolve(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const gifOut = path.join(assetsDir, 'demo-simulation.gif');
  console.log('Generating optimized GIF with ffmpeg...');
  const ffmpegCmd = `ffmpeg -y -framerate 22 -i "${framesDir}\\frame_%05d.jpg" -vf "fps=18,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 "${gifOut}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  console.log('Cleaning up temporary frames...');
  fs.rmSync(framesDir, { recursive: true, force: true });

  console.log('DONE! Output saved to:', gifOut);
}

record().catch(err => {
  console.error(err);
  process.exit(1);
});
