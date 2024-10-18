document.addEventListener("DOMContentLoaded", function() {
    const mapContent = document.getElementById("map-content"); // Reference to zoomable content inside map
    const mapContainer = document.getElementById("map"); // Reference to the map container
    let scale = 1;  // Initial zoom scale
    let panX = 0;   // Initial pan X position
    let panY = 0;   // Initial pan Y position
    let isPanning = false;  // To track if the user is panning
    let startX = 0; // Starting X position for panning
    let startY = 0; // Starting Y position for panning

    // Apply zoom and pan transforms to the map content (not the map container)
    function applyTransform() {
        mapContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }

    // Prevent text selection during panning
    document.body.style.userSelect = "none";

    // Handle zooming (mouse wheel) based on cursor position
    mapContainer.addEventListener("wheel", function(event) {
        event.preventDefault();

        const zoomFactor = 0.1; // Sensitivity of the zoom
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rect = mapContent.getBoundingClientRect();
        const offsetX = mouseX - rect.left;
        const offsetY = mouseY - rect.top;

        // Adjust scale based on wheel direction
        const deltaScale = event.deltaY * -zoomFactor;
        const oldScale = scale;
        scale = Math.min(Math.max(scale + deltaScale, 0.5), 5); // Limit zoom level between 0.5 and 5

        // Adjust pan based on zoom change and cursor position
        panX -= (offsetX / oldScale) * (scale - oldScale);
        panY -= (offsetY / oldScale) * (scale - oldScale);

        applyTransform();
    });

    // Handle panning (mouse drag)
    mapContent.addEventListener("mousedown", function(event) {
        isPanning = true;
        startX = event.clientX - panX;
        startY = event.clientY - panY;
    });

    mapContent.addEventListener("mousemove", function(event) {
        if (!isPanning) return;
        panX = event.clientX - startX;
        panY = event.clientY - startY;
        applyTransform();
    });

    mapContent.addEventListener("mouseup", function() {
        isPanning = false;
    });

    mapContent.addEventListener("mouseleave", function() {
        isPanning = false;
    });

    // Fetch assets from the database via API
    fetch('/api/assets')
        .then(response => response.json())
        .then(data => renderAssets(data))
        .catch(error => console.error('Error fetching assets:', error));

    // Fetch tunnels from the database via API
    fetch('/api/tunnels')
        .then(response => response.json())
        .then(data => renderTunnels(data))
        .catch(error => console.error('Error fetching tunnels:', error));

    // Function to render assets as points
    function renderAssets(assets) {
        assets.forEach(asset => {
            const assetDiv = document.createElement('div');
            assetDiv.className = 'asset';

            // Simulate Z coordinate by adjusting size (bigger means closer/higher)
            const size = Math.max(10 - (asset.z_coord / 5), 3);
            assetDiv.style.width = `${size}px`;
            assetDiv.style.height = `${size}px`;

            // Simplified 2D projection from voxel (X, Y, Z)
            assetDiv.style.left = `${asset.x_coord}px`;
            assetDiv.style.top = `${asset.y_coord}px`;

            // Create label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.innerHTML = `<strong>${asset.label}</strong><br>
                                  Type: ${asset.type}<br>
                                  Status: ${asset.status}<br>
                                  Coordinates: (${asset.x_coord}, ${asset.y_coord}, ${asset.z_coord})`;
            labelDiv.style.left = `${asset.x_coord + 10}px`; // Adjust label position
            labelDiv.style.top = `${asset.y_coord - 10}px`;

            // Hover event to show label
            assetDiv.addEventListener('mouseenter', () => {
                labelDiv.style.display = 'block';
            });

            assetDiv.addEventListener('mouseleave', () => {
                labelDiv.style.display = 'none';
            });

            mapContent.appendChild(assetDiv);
            mapContent.appendChild(labelDiv);
        });
    }

    // Function to render tunnels/roads as lines
    function renderTunnels(tunnels) {
        tunnels.forEach(tunnel => {
            const tunnelDiv = document.createElement('div');
            tunnelDiv.className = 'tunnel-line';

            // Simplified 2D line from voxel (X, Y, Z)
            const length = Math.sqrt(
                Math.pow(tunnel.x2_coord - tunnel.x1_coord, 2) + Math.pow(tunnel.y2_coord - tunnel.y1_coord, 2)
            );
            const angle = Math.atan2(tunnel.y2_coord - tunnel.y1_coord, tunnel.x2_coord - tunnel.x1_coord) * (180 / Math.PI);
            
            tunnelDiv.style.left = `${tunnel.x1_coord}px`;
            tunnelDiv.style.top = `${tunnel.y1_coord}px`;
            tunnelDiv.style.width = `${length}px`;
            tunnelDiv.style.transform = `rotate(${angle}deg)`;

            // Color based on type (subway or train)
            tunnelDiv.style.backgroundColor = tunnel.type === 'subway' ? '#4CAF50' : '#FF5722';

            // Create label for tunnels
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.innerHTML = `<strong>${tunnel.label}</strong><br>
                                  Type: ${tunnel.type}<br>
                                  Start Coordinates: (${tunnel.x1_coord}, ${tunnel.y1_coord}, ${tunnel.z1_coord})<br>
                                  End Coordinates: (${tunnel.x2_coord}, ${tunnel.y2_coord}, ${tunnel.z2_coord})`;
            labelDiv.style.left = `${tunnel.x1_coord + 10}px`; // Adjust label position
            labelDiv.style.top = `${tunnel.y1_coord - 10}px`;

            // Hover event to show label
            tunnelDiv.addEventListener('mouseenter', () => {
                labelDiv.style.display = 'block';
            });

            tunnelDiv.addEventListener('mouseleave', () => {
                labelDiv.style.display = 'none';
            });

            mapContent.appendChild(tunnelDiv);
            mapContent.appendChild(labelDiv);
        });
    }
});
