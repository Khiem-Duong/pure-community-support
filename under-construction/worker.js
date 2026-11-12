/* Under-construction Worker for purecommunitysupport.com while the full site lives on a preview
   subdomain. Paste this file into a separate Worker in the Cloudflare dashboard; delete it at launch. */

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pure Community Support</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #F5F1EA; color: #4A342A; font: 18px/1.5 system-ui, sans-serif; text-align: center; padding: 24px; box-sizing: border-box; }
  </style>
</head>
<body>
  <p>Website under construction.</p>
</body>
</html>`;

export default {
  fetch() {
    return new Response(PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  },
};
