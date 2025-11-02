import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export class VeoAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize(cookieData = []) {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.goto('https://flow.google.com');
    if (Array.isArray(cookieData) && cookieData.length) {
      await this.page.setCookie(...cookieData);
    }
  }

  async submitPrompt(prompt, sceneIndex) {
    if (!this.page) {
      throw new Error('Automation not initialized');
    }
    try {
      await this.page.waitForSelector('textarea[aria-label*="prompt"]');
      await this.page.click('textarea[aria-label*="prompt"]');
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('A');
      await this.page.keyboard.up('Control');
      await this.page.type(prompt);
      await this.page.keyboard.press('Enter');
      await this.page.waitForSelector('video', { timeout: 120000 });
      const videoUrl = await this.extractVideoUrl();
      return await this.downloadVideo(videoUrl, sceneIndex);
    } catch (error) {
      console.error(`Error processing scene ${sceneIndex}:`, error);
      throw error;
    }
  }

  async extractVideoUrl() {
    return this.page.evaluate(() => {
      const video = document.querySelector('video');
      return video?.src;
    });
  }

  async downloadVideo(videoUrl, sceneIndex) {
    if (!videoUrl) {
      throw new Error('No video URL found');
    }
    const response = await this.page.goto(videoUrl);
    const buffer = await response.buffer();
    const outputDir = path.join(process.cwd(), 'backend', 'uploads', 'videos');
    fs.mkdirSync(outputDir, { recursive: true });
    const filePath = path.join(outputDir, `scene-${sceneIndex}.mp4`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
