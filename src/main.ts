import { App } from './app';

declare global { interface Window { app: App; } }

async function main() {
    const app = new App();
    await app.init();
    const el = document.querySelector('#app');
    if (el) {
      app.register(el);
    } else {
      throw new Error('Element with id "app" not found, cannot register the app.');
    }
    // Expose the app instance globally for debugging
    window.app = app;
}

await main();
