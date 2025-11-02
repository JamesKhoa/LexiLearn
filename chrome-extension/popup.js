document.getElementById('extract').addEventListener('click', async () => {
  const cookies = await chrome.cookies.getAll({ domain: '.google.com' });
  const flowCookies = cookies.filter(cookie =>
    cookie.name.includes('SID') ||
    cookie.name.includes('HSID') ||
    cookie.name.includes('SSID')
  );
  await navigator.clipboard.writeText(JSON.stringify(flowCookies, null, 2));
  alert('Cookies copied to clipboard!');
});
