export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <span className="material-icons mr-2 text-2xl">wb_sunny</span>
              <h2 className="text-xl font-bold">WeatherView</h2>
            </div>
            <p className="text-sm text-neutral-light">
              Accurate weather forecasts and real-time updates to help you plan your day with confidence.
            </p>
          </div>
          
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-neutral-light transition-colors">Home</a></li>
              <li><a href="#weather-maps" className="hover:text-neutral-light transition-colors">Weather Maps</a></li>
              <li><a href="#favorites" className="hover:text-neutral-light transition-colors">Favorites</a></li>
              <li><a href="#" onClick={(e) => { 
                e.preventDefault(); 
                document.querySelector('[data-event="click:toggleSettings"]')?.dispatchEvent(new Event('click'));
              }} className="hover:text-neutral-light transition-colors">Settings</a></li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-neutral-light transition-colors"><span className="material-icons">facebook</span></a>
              <a href="#" className="hover:text-neutral-light transition-colors"><span className="material-icons">twitter</span></a>
              <a href="#" className="hover:text-neutral-light transition-colors"><span className="material-icons">instagram</span></a>
            </div>
            <p className="text-sm text-neutral-light">Weather data provided by OpenWeatherMap</p>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-neutral-dark text-sm text-neutral-light text-center">
          <p>&copy; {new Date().getFullYear()} WeatherView. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
