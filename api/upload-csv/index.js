const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');

const containerName = 'model-comparison-demo';
const accountUrl = 'https://skynetpgaml4570037799.blob.core.windows.net'; // e.g. https://mystorage.blob.core.windows.net

let blobServiceClient;
function getBlobService() {
	if (!accountUrl) {
		throw new Error('Missing STORAGE_ACCOUNT_URL environment variable');
	}
	if (!blobServiceClient) {
		blobServiceClient = new BlobServiceClient(accountUrl, new DefaultAzureCredential());
	}
	return blobServiceClient;
}

module.exports = async function (context, req) {
	const start = Date.now();
	try {
		let csvText;
		const contentType = (req.headers['content-type'] || '').toLowerCase();
		if (contentType.includes('application/json')) {
			csvText = (req.body && req.body.csv) || '';
		} else {
			csvText = req.body || '';
		}
		if (!csvText || typeof csvText !== 'string') {
			context.log.warn('[upload-csv] invalid body - missing csv');
			context.res = { status: 400, jsonBody: { error: 'Missing csv text' } };
			return;
		}

		// Optional fields from front-end
		const requestedFileName = req.body?.fileName;
		const evaluationId = req.body?.evaluationId;
		const userId = req.body?.userId;

		const service = getBlobService();
		const container = service.getContainerClient(containerName);
		await container.createIfNotExists();

		// Sanitize provided filename or fallback
		let fileName = requestedFileName && typeof requestedFileName === 'string'
			? requestedFileName
			: null;
		if (fileName) {
			fileName = fileName.replace(/\\/g, '/'); // avoid backslashes
			fileName = fileName.split('/').pop(); // drop any path attempts
			fileName = fileName.replace(/[^a-zA-Z0-9-_\.]/g, '_');
			if (!fileName.endsWith('.csv')) fileName += '.csv';
		}
		if (!fileName) {
			const ts = new Date().toISOString().replace(/[:.]/g, '-');
			fileName = `evaluation-${ts}.csv`;
		}

		const blockBlob = container.getBlockBlobClient(fileName);
		context.log.info('[upload-csv] uploading', {
			fileName,
			length: csvText.length,
			evaluationId,
			userId
		});

		await blockBlob.upload(csvText, Buffer.byteLength(csvText), {
			blobHTTPHeaders: { blobContentType: 'text/csv; charset=utf-8' },
			metadata: {
				created: new Date().toISOString(),
				source: 'swa',
				evaluationId: evaluationId ? String(evaluationId) : undefined,
				userId: userId ? String(userId) : undefined
			}
		});

		const ms = Date.now() - start;
		context.log.info('[upload-csv] success', { fileName, ms });
		context.res = { status: 200, jsonBody: { ok: true, blobName: fileName, url: blockBlob.url, ms } };
	} catch (err) {
		const ms = Date.now() - start;
		context.log.error('[upload-csv] error', { message: err.message, ms });
		context.res = { status: 500, jsonBody: { error: err.message || 'Upload failed' } };
	}
};
