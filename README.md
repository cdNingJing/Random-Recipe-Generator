# Random Recipe Generator 🎲

A beautiful and interactive web application that helps you discover amazing recipes through a card-drawing experience. Built with vanilla JavaScript, this application provides a fun and engaging way to find your next cooking adventure.

## ✨ Features

- **Interactive Card Drawing**: Unique card-drawing animation to select recipes
- **Detailed Recipe Information**: 
  - Ingredients with measurements
  - Step-by-step cooking instructions
  - Recipe origin and category
  - Recipe images and videos (when available)
- **Recipe History**: Keep track of previously viewed recipes
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Video Integration**: Watch cooking tutorials directly in the app (YouTube integration)

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls and loading recipes)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/random-recipe-generator.git
```

2. Navigate to the project directory:
```bash
cd random-recipe-generator
```

3. Open `index.html` in your web browser or serve it using a local server.

### Running with a Local Server

Using Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Using Node.js:
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server
```

## 🛠️ Technical Stack

- HTML5
- CSS3 (with animations and transitions)
- Vanilla JavaScript (ES6+)
- [TheMealDB API](https://www.themealdb.com/api.php) for recipe data
- Font Awesome for icons

## 📁 Project Structure

```
random-recipe-generator/
├── index.html
├── styles/
│   ├── main.css
│   ├── cards.css
│   └── animations.css
├── js/
│   ├── api.js
│   ├── cards.js
│   ├── history.js
│   └── main.js
└── README.md
```

## 🎮 Usage

1. Click the "Draw Cards" button to start
2. Watch the cards animate and flip
3. Select a recipe card to view details
4. View ingredients and cooking instructions
5. Watch the cooking video if available
6. Access your recipe history from the sidebar

## 🔄 API Integration

The application uses TheMealDB's free API to fetch random recipes. Each recipe includes:
- Recipe name and category
- List of ingredients and measurements
- Cooking instructions
- Recipe image
- YouTube video link (when available)

## 📱 Responsive Design

The application is fully responsive and provides an optimal experience across different devices:
- Desktop: Full card-drawing experience with animations
- Tablet: Adapted layout with maintained functionality
- Mobile: Streamlined interface for smaller screens

If you have any questions or suggestions, feel free to open an issue or contact us. 