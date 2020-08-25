const App = require('./src/app');
const app = App.initApp();

(async () => {
  try {
    await App.start(app);
    console.log('Service started successfully!');
  } catch (error) {
    console.error(error, `Service wasn't able to start!`);
    process.exit(16);
  }
})();
