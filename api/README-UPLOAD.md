Minimal CSV Upload API (Azure Static Web Apps Functions)
=====================================================

Functions added:
 - ping (GET /api/ping) health check
 - upload-csv (POST /api/upload-csv) accepts JSON { csv: "..." }

Environment variables (set in Azure Static Web App -> Configuration):
 - STORAGE_ACCOUNT_URL : https://<youraccount>.blob.core.windows.net
 - CSV_CONTAINER       : questionnaire (or custom container)

Managed Identity setup:
 1. In your Storage Account, assign role "Storage Blob Data Contributor" to the Static Web App's managed identity (Principal ID visible in Azure Portal under Identity for the SWA resource).
 2. Ensure the container exists or let the function auto-create it (requires Contributor role on container scope - Data Contributor suffices for createIfNotExists()).

Local development:
 - Update local.settings.json STORAGE_ACCOUNT_URL to match your dev storage (or use Azurite + connection string approach refactor if needed).
 - Install deps inside api/: npm install
 - Run: npx swa start http://localhost:5173 --api-location api

Front-end integration:
 - CSV still downloads locally.
 - After download, a POST /api/upload-csv is fired (non-blocking). Check browser devtools Network panel for status 200.

Response (200 OK):
 { ok: true, blobName: "evaluation-...csv", url: "https://.../questionnaire/..." }

Troubleshooting:
 - 401/403: verify role assignment propagation (may take minutes).
 - 500 with message about MSI: ensure Static Web App Standard plan with Managed Identity enabled (if Basic/Free without MI support, switch plan or use a Function App backend instead).
 - Missing STORAGE_ACCOUNT_URL: set config and redeploy.

Cleanup:
 - Remove duplicate folder api/uploadCsv if unused; keep only api/upload-csv.
