module.exports = {
  apps: [
    {
      name: "loop-present-auto", // Name of your application
      script: "index.ts", // Entry point of your application
      interpreter: "bun", // Specify Bun as the interpreter
      // Optional: If Bun is not in your system's PATH, you can specify its full path:
      // interpreter: "~/.bun/bin/bun",
      // env: {
      //   PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add Bun's path to environment variables
      // },
    },
  ],
};
