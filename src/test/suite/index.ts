import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true
  });

  const testsRoot = path.resolve(__dirname, '.');

  // Find all test files using Promise-based glob pattern matching
  const files = await new Promise<string[]>((resolve, reject) => {
    glob.glob('**/**.test.js', { cwd: testsRoot }, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });

  // Add files to the test suite
  files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

  try {
    // Run the mocha test
    return new Promise<void>((resolve, reject) => {
      mocha.run(failures => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}