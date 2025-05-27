// content.js
// This script runs on https://login.microsoftonline.com/*

console.log("Login Selector content script loaded.");

const accountMap = {
  "_debug@prdtrs01.prod.outlook.com": [
    {
      client_id: "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
    },
    {
      client_id: "e9f49c6b-5ce5-44c8-925d-015017e9f7ad",
    },
    {
      redirect_uri: "https://ms.portal.azure.com",
    },
    {
      pathStartsWith:
        "https://login.microsoftonline.com/cdc5aeea-15c5-4db6-b079-fcadd2505dc2",
    },
  ],
  "_jit@prdtrs01.prod.outlook.com": [
    {
      client_id: "00000000-0000-0000-0000-000000000000",
    },
  ],
  "@microsoft.com": [
    {
      client_id: "b5b61b37-aeb3-424b-803b-356fb0c0f0d7",
    },
    {
      resource: "https://graph.microsoft.com",
    },
    {
      pathStartsWith:
        "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
    },
    {
      redirect_uri: "https://portal.microsofticm.com",
    },
    {
      redirect_uri: "https://eng.ms",
    },
  ],
};

function selectAccount(currentUrl) {
  const urlObj = new URL(currentUrl);
  const urlParams = new URLSearchParams(urlObj.search);
  const client_id = urlParams.get("client_id");
  const resource = urlParams.get("resource");
  const redirect_uri = urlParams.get("redirect_uri");
  const path = urlObj.href;

  // Check each account rule
  for (const [account, rules] of Object.entries(accountMap)) {
    for (const rule of rules) {
      if (rule.client_id && client_id === rule.client_id) {
        return account;
      }
      if (rule.resource && resource === rule.resource) {
        return account;
      }
      if (rule.pathStartsWith && path.startsWith(rule.pathStartsWith)) {
        return account;
      }
      if (rule.redirect_uri && redirect_uri && redirect_uri.indexOf(rule.redirect_uri) !== -1) {
        return account;
      }
    }
  }
  return null; // No match found
}

/**
 * Scans the page for elements with className 'table' or a specific button, clicks the first matching element based on config, and returns the account name or action.
 * @param {string} account - The account to find in the tables.
 * @param {Array<{hostname: string, buttonId: string}>} [options] - Optional config for site-specific logic.
 *   options.buttonId: If provided, will try to click this button instead of table logic.
 *   options.hostname: If provided, restricts button click to this hostname.
 * @returns {string|null} The matched account name, 'buttonClicked', or null if not found.
 */
function findAndClickAccountOrButton(account, options = [{}]) {
  // If a buttonId and hostname are provided, try to click the button for that site
  var buttonOpt = options.find(option => document.getElementById(option.buttonId) && window.location.hostname === option.hostname);
  if (account == null && buttonOpt) {
    document.getElementById(buttonOpt.buttonId).click();
    return 'buttonClicked';
  }
  const tables = document.getElementsByClassName("table");
  for (const table of tables) {
    const text = table.innerText || table.textContent || "";
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

function onPageReady() {
  setTimeout(() => {
    const account = selectAccount(window.location.href);
    findAndClickAccountOrButton(account, [
      { buttonId: "AuthByCardBtn", hostname: "tafe.prdtrs01.outlook.com" },
      { buttonId: "signInButton", hostname: "portal.microsofticm.com" },
    ]);
  }, 1000); // Delay to ensure the page is fully loaded
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", onPageReady);
} else {
  onPageReady();
}
