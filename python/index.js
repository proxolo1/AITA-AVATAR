const { spawn } = require('child_process');

const pythonProcess = spawn('python', ['./python/app.py']);

pythonProcess.stdout.on('data', (data) => {
  console.log(`Python script output: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Error executing Python script: ${data}`);
});
