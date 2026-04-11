module.exports = {
  apps: [
    {
      name: "frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",

      cwd: "/var/www/bass_port_pro_web",

      exec_mode: "fork", // ✅ IMPORTANT
      instances: 1, // ❗ DO NOT use cluster for Next.js

      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
