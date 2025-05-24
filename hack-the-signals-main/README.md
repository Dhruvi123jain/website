## ©️ Copyright

© 2025 Yagnesh Bhavsar . All rights reserved.

This website and its contents are protected by copyright law.  
Unauthorized copying, distribution, or modification of any part of this project without prior written permission is strictly prohibited.

For permissions or inquiries, please contact: [yagnesh2810@gmail.com]


# Hack The Signals - Hackathon Website

A professional hackathon website for the IEEE Signal Processing Society with database integration.

## Features

- Responsive design with dark theme and neon green accents
- Registration form with database storage
- Admin dashboard to view and manage registrations
- Team management system
- Real-time statistics display

## Database Setup

This website uses Firebase for database storage and authentication. Follow these steps to set up the database:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Firestore Database and Authentication services

2. **Initialize the Database**:
   - Open `db-init.html` in your browser
   - Enter an email and password for the admin account
   - Click "Initialize Database" to set up the database structure and create an admin user
   - This will also create some sample data for testing

3. **Access the Admin Dashboard**:
   - Go to `admin.html`
   - Log in with the admin credentials you created
   - You can now view and manage all registrations

## File Structure

- `index.html` - Main website
- `admin.html` - Admin dashboard
- `db-init.html` - Database initialization page
- `firebase-config.js` - Firebase configuration
- `database-service.js` - Database service functions
- `registration.js` - Registration form functionality
- `admin.js` - Admin dashboard functionality
- `db-init.js` - Database initialization script
- `styles.css` - Main styles
- `neon-effects.css` - Neon theme styles
- `registration.css` - Registration form styles
- `admin.css` - Admin dashboard styles
- `neon-cursor.js` - Background effect
- `script.js` - Main JavaScript
- `cursor.js` - Custom cursor effect

## Database Structure

The database has the following collections:

1. **registrations** - Stores all registration data
   - First name, last name, email, phone, college
   - Membership type and IEEE membership number
   - Team name and team members
   - Experience level and dietary restrictions
   - Registration date and status

2. **teams** - Stores team information
   - Team name
   - Team members (list of emails)
   - Creation date

3. **users** - Stores admin users
   - User ID
   - Email
   - Role (admin)
   - Creation date

## Customization

To customize the website for your own hackathon:

1. Update the event details in `index.html`
2. Modify the pricing in `registration.js`
3. Update the Firebase configuration in `firebase-config.js`
4. Customize the styles in the CSS files

## Security

- The admin dashboard is protected with Firebase Authentication
- Only users with the "admin" role can access the dashboard
- Database rules should be set up in Firebase Console to restrict access

## Deployment

1. Deploy the website to a hosting service (Firebase Hosting recommended)
2. Update the Firebase configuration with your production project details
3. Set up proper Firebase Security Rules for your database

## Credits

- Built with HTML, CSS, and JavaScript
- Uses Firebase for database and authentication
- Icons from Font Awesome
- Fonts from Google Fonts
