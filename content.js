// content.js
// This script runs on https://login.microsoftonline.com/*

console.log('Login Selector content script loaded.');

const accountMap = {
  "_debug@prdtrs01.prod.outlook.com": [
    {
      clientId: "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
    },
  ],
  "_jit@prdtrs01.prod.outlook.com": [
    {
      clientId: "00000000-0000-0000-0000-000000000000",
    },
  ],
  "@microsoft.com": [
    {
      clientId: "b5b61b37-aeb3-424b-803b-356fb0c0f0d7",
    },
    {
      resource: "https://graph.microsoft.com",
    },
    {
      pathStartsWith:
        "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
    },
  ],
};

function selectAccount(currentUrl) {
  const urlObj = new URL(currentUrl);
  const urlParams = new URLSearchParams(urlObj.search);
  const clientId = urlParams.get('client_id');
  const resource = urlParams.get('resource');
  const path = urlObj.href;

  // Check each account rule
  for (const [account, rules] of Object.entries(accountMap)) {
    for (const rule of rules) {
      if (rule.clientId && clientId === rule.clientId) {
        return account;
      }
      if (rule.resource && resource === rule.resource) {
        return account;
      }
      if (rule.pathStartsWith && path.startsWith(rule.pathStartsWith)) {
        return account;
      }
    }
  }
  return null; // No match found
}

/**
 * Scans the page for elements with className 'table', clicks the first element containing a word ending with an accountMap key, and returns the account name.
 * @param {Object} account - The account to find in the tables.
 * @returns {string|null} The matched account name or null if not found.
 */
function findAndClickAccountInTables(account) {
  const tables = document.getElementsByClassName('table');
  for (const table of tables) {
    const text = table.innerText || table.textContent || '';
    const words = text.split(/\s+/);
    for (const word of words) {
      if (word.endsWith(account)) {
        table.click();
        return word;
      }
    }
  }
  return null;
}

// Call selectAccount on page load
window.addEventListener('DOMContentLoaded', function() {
  const account = selectAccount(window.location.href);
  if (account) {
    findAndClickAccountInTables(account);
  } else {
    console.log('No account matched for this page.');
  }
});
