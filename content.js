// content.js
// This script runs on https://login.microsoftonline.com/*

console.log('Login Selector content script loaded.');
// Add your logic here to interact with the login page

/**
 * Checks if the 'client_id' URL parameter matches any value in the provided array.
 * @param {string[]} allowedClientIds - Array of allowed client_id values.
 * @returns {boolean} True if client_id matches one of the allowed values, false otherwise.
 */
function isAllowedClientId(allowedClientIds) {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('client_id');
  if (!clientId) return false;
  return allowedClientIds.includes(clientId);
}

function selectAccount(currentUrl) {
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
        pathStartsWith: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
      },
    ],
  };

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
 * Scans the page for elements with className 'table' and returns the account name if any cell contains a word ending with an accountMap key.
 * @param {Object} accountMap - The account mapping object.
 * @returns {string|null} The matched account name or null if not found.
 */
function findAccountInTables(accountMap) {
  const tables = document.getElementsByClassName('table');
  const accountKeys = Object.keys(accountMap);
  for (const table of tables) {
    // Search all text nodes in the table
    const text = table.innerText || table.textContent || '';
    const words = text.split(/\s+/);
    for (const word of words) {
      for (const key of accountKeys) {
        if (word.endsWith(key)) {
          return word;
        }
      }
    }
  }
  return null;
}

/**
 * Scans the page for elements with className 'table', clicks the first element containing a word ending with an accountMap key, and returns the account name.
 * @param {Object} accountMap - The account mapping object.
 * @returns {string|null} The matched account name or null if not found.
 */
function findAndClickAccountInTables(accountMap) {
  const tables = document.getElementsByClassName('table');
  const accountKeys = Object.keys(accountMap);
  for (const table of tables) {
    const text = table.innerText || table.textContent || '';
    const words = text.split(/\s+/);
    for (const word of words) {
      for (const key of accountKeys) {
        if (word.endsWith(key)) {
          table.click();
          return word;
        }
      }
    }
  }
  return null;
}

// Call selectAccount on page load
window.addEventListener('DOMContentLoaded', function() {
  const account = selectAccount(window.location.href);
  if (account) {
    console.log('Matched account:', account);
  } else {
    console.log('No account matched for this page.');
  }
});
