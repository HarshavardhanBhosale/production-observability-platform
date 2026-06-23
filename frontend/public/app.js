document.getElementById('fetch-btn').addEventListener('click', async () => {
    const fetchBtn = document.getElementById('fetch-btn');
    const statusMsg = document.getElementById('status-message');
    const outputStream = document.getElementById('output-stream');

    fetchBtn.disabled = true;
    statusMsg.className = 'status-box loading';
    statusMsg.innerText = 'Initializing backend connection routing parameters...';
    statusMsg.style.display = 'block';
    outputStream.innerText = 'Awaiting runtime payload payload response data...';

    try {
        const configResponse = await fetch('/config');
        if (!configResponse.ok) {
            throw new Error('Failed to retrieve frontend system environment mapping configs');
        }
        const config = await configResponse.json();
        
        const backendEndpoint = `${config.BACKEND_URL}/health`;
        
        const apiResponse = await fetch(backendEndpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Request-ID': 'client-ui-' + Math.random().toString(36).substr(2, 9)
            }
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            throw new Error(data.detail ? JSON.stringify(data.detail) : 'Backend health test failed');
        }

        statusMsg.className = 'status-box success';
        statusMsg.innerText = 'Connection verified. Pipeline active.';
        outputStream.innerText = JSON.stringify(data, null, 4);

    } catch (error) {
        statusMsg.className = 'status-box error';
        statusMsg.innerText = 'Network Fault: Verification lifecycle terminated.';
        outputStream.innerText = `[Client Exception Logged]\nMessage: ${error.message}`;
        console.error('Frontend client execution exception trace:', error);
    } finally {
        fetchBtn.disabled = false;
    }
});
