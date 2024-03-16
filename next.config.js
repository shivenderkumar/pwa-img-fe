/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

const nextConfig = withPWA({
  reactStrictMode: true,
});

module.exports = ()=>{
  return {
    ...nextConfig,
    env:{
      host: "http://localhost:3000",
      hola_be: "http://localhost:5000"
    }
  }
};
