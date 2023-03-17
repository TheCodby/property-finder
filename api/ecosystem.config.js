module.exports = {
  apps: [
    {
      name: "property-finder-api",
      script: "./index.ts",
      interpreter: "",
      watch: ["api", "locales", "utils"],
      ignore_watch: ["node_modules", "logs"],
    },
  ],
};
