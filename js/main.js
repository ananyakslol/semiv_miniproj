document.addEventListener('DOMContentLoaded', function() {
    // Welcome modal functionality
    const welcomeModal = document.getElementById('welcome-modal');
    const startExploringBtn = document.getElementById('start-exploring');
    
    // Show welcome modal after a short delay
    setTimeout(() => {
      welcomeModal.style.display = 'flex';
    }, 1000);
    
    startExploringBtn.addEventListener('click', function() {
      welcomeModal.style.opacity = '0';
      setTimeout(() => {
        welcomeModal.style.display = 'none';
      }, 500);
    });
    
    // Add double-click handlers to planet elements in the data panel
    $('#data a').dblclick(function(e) {
      e.preventDefault();
      const planet = $(this).attr('title');
      openPlanetPage(planet);
    });
    
    // Add double-click handlers to the planets in the visualization
    $('.planet').parent().dblclick(function() {
      const planetId = $(this).closest('.orbit').attr('id');
      if (planetId) {
        openPlanetPage(planetId);
      }
    });
    
    // Special case for the sun
    $('#sun').dblclick(function() {
      openPlanetPage('sun');
    });
    
    function openPlanetPage(planet) {
      // Add loading animation before opening the page
      $('body').append('<div class="planet-loading"><div class="loading-spinner"></div></div>');
      
      setTimeout(() => {
        window.open(`planets/${planet}.html`, '_blank');
        $('.planet-loading').remove();
      }, 800);
    }
    
    // Add CSS for loading animation
    const style = document.createElement('style');
    style.textContent = `
      .planet-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      
      .loading-spinner {
        width: 100px;
        height: 100px;
        border: 5px solid transparent;
        border-top: 5px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  });
  