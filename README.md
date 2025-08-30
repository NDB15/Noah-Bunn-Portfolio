# Noah Bunn - Personal Portfolio Website

A dynamic, interactive portfolio website inspired by the aesthetic and music of the game "Bomb Rush Cyberfunk". This project showcases my work as a Computer Science student at North Carolina A&T State University.

## 🎨 Design Inspiration

This portfolio is heavily inspired by the art style and music from Bomb Rush Cyberfunk. The design draws from the game's main menu interface, featuring:
- Dynamic video backgrounds with mirrored effects
- Retro-futuristic color scheme
- Interactive elements and smooth animations
- Custom typography using the Induction font
- Immersive background music system

## ✨ Features

### Interactive Music System
- **Continuous Playback**: Music continues seamlessly across all pages
- **Manual Controls**: Skip, rewind, and volume control
- **Smart Autoplay**: Attempts autoplay with graceful fallback prompts
- **Cross-Page Persistence**: Same song, same position when navigating

### Responsive Design
- **Video Backgrounds**: Mirrored video effects on left and right sides
- **Adaptive Layout**: 60% center content area with bordered design
- **Mobile Friendly**: Responsive grid layouts and flexible components

### Accessibility Features
- **Font Toggle**: Switch between custom Induction font and Arial for readability
- **High Contrast**: Yellow background on red text for visibility
- **Keyboard Navigation**: Full keyboard accessibility support

### Interactive Elements
- **Typewriter Effect**: Animated name display on home page
- **Hover Animations**: Smooth transforms and scaling effects
- **Photo Gallery**: Expandable image collage with 3x zoom on hover
- **Smooth Transitions**: CSS transitions for all interactive elements

## 📁 Project Structure

```
portfolio/
├── index.html              # Home page with introduction
├── projects.html           # Project showcase page
├── gallery.html            # Photo gallery
├── introduction.html       # About me page
├── js/
│   └── shared-music.js     # Global music system
├── img/                    # Images and photos
├── demos/                  # Project demo images
├── music/                  # Background music files
├── models/                 # Animated GIF models
├── logos/                  # Social media icons
└── font/
    └── induction/          # Custom Induction font files
```

## 🚀 Technologies Used

- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Advanced styling with animations and responsive design
- **JavaScript**: Interactive functionality and music system
- **Video Integration**: WebM background videos
- **Custom Fonts**: Induction font for unique typography
- **Responsive Design**: Mobile-first approach with flexible layouts

## 🎵 Music System

The portfolio features a sophisticated music system that:
- Uses a global audio element that persists across page navigation
- Saves music state using both global variables and localStorage
- Provides volume controls, skip/rewind functionality
- Attempts autoplay with user-friendly fallback prompts
- Maintains perfect continuity when switching between pages

## 📱 Pages Overview

### Home (index.html)
- Animated typewriter effect with name
- Photo collage with hover zoom effects
- Social media links with animated GIFs
- Game-style navigation menu
- Professional introduction and bio

### Projects (projects.html)
- Showcase of major projects including:
  - **Earworm**: Music sharing mobile app (React, TypeScript, Capacitor)
  - **Small But Mighty**: Local business discovery platform (Python, JavaScript)
  - **Penny Pinch**: Student budgeting web platform (HTML, CSS, JavaScript)
  - **This Portfolio**: The current website you're viewing
- Project images, descriptions, and technology stacks
- Links to GitHub repositories and live demos

### Gallery (gallery.html)
- Clean photo gallery displaying personal and professional images
- Images from computer graphics, music performances, martial arts, and certifications
- Hover effects and responsive grid layout

## 🛠️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NDB15/Noah-Bunn-Portfolio.git
   cd Noah-Bunn-Portfolio
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server for best performance:
   ```bash
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```

3. **File Requirements**:
   - Ensure all media files (images, videos, music) are in their respective directories
   - The Induction font should be properly loaded from the `font/` directory

## 🎯 Key Features Implementation

### Font Accessibility
- Click "having trouble reading?" to switch to Arial font
- Improves readability for users with dyslexia or visual difficulties
- Toggle back with "go back" button

### Music Controls
- **Volume Slider**: Adjust background music volume
- **Skip Button**: Move to next track manually
- **Rewind Button**: Restart current track
- **Mute Toggle**: Click volume icon to mute/unmute

### Navigation
- Smooth transitions between pages
- Consistent header with social links
- Back buttons on all sub-pages
- Responsive mobile navigation

## 🎨 Color Scheme

- **Primary Brown**: `#8B7355` - Headers and accents
- **Orange Accent**: `#FF8C00` - Interactive elements and links
- **Cream Background**: Custom background image with transparency
- **Video Borders**: Matching brown (`#8B7355`) borders on content area

## 📧 Contact Information

- **Email**: [noahdbunn@gmail.com](mailto:noahdbunn@gmail.com)
- **LinkedIn**: [noah-bunn](https://linkedin.com/in/noah-bunn)
- **GitHub**: [NDB15](https://github.com/NDB15)
- **Resume**: [View Online](https://docs.google.com/document/d/e/2PACX-1vQunTZddT4HU_-uWdqkWLKPWHhSw6K9ip5TrspvJMGz9bllE21tpf4IYKK0oiwm-GUtHajxETQ4WGkk/pub)

## 🎓 About the Developer

I'm Noah Bunn, a Computer Science senior at North Carolina A&T State University. This portfolio represents my passion for creating innovative software solutions that combine bold functionality with intuitive design. My experience spans web development, hackathon competitions, a Software Engineering internship at Cisco Security, and music performance.

## 🏆 Project Highlights

This portfolio demonstrates:
- Advanced CSS animations and responsive design
- Complex JavaScript state management
- Cross-browser audio handling and autoplay policies
- Accessibility best practices
- Modern web development techniques
- Creative problem-solving and attention to detail

---

*Built with passion and inspired by Bomb Rush Cyberfunk* 🎮🎵
