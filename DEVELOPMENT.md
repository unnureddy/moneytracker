# Local Development Setup Guide

This guide will help you set up and run the MoneyTracker application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Git**
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/unnureddy/moneytracker.git
cd moneytracker
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Start the Development Server

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`.

If it doesn't open automatically, manually navigate to `http://localhost:3000`.

### 4. Using the Application in Demo Mode

The application currently runs in demo mode using browser localStorage:

#### Create an Account
1. Click the "Sign Up" tab
2. Enter a username (any name you like)
3. Enter an email address
4. Enter a password (minimum 6 characters)
5. Confirm your password
6. Click "Sign Up"

#### Login
1. Use the username and password you created
2. Click "Login"

#### Add Transactions
1. Select transaction type (Expense or Credit)
2. Enter the amount
3. Select a date
4. Choose a category
5. Add an optional description
6. Click "Add Expense" or "Add Credit"

#### View Dashboard
- See your total credits, expenses, and balance
- View top spending categories
- Monitor transaction count

#### Manage Transactions
- Filter by type (All, Expenses, Credits)
- Sort by date or amount
- Delete transactions with the trash icon

### 5. Testing the Build

To test the production build locally:

```bash
npm run build
npx serve -s build
```

The app will be served at `http://localhost:3000` (or another port if 3000 is busy).

## Project Structure Overview

```
moneytracker/
├── public/              # Static files
│   └── index.html       # HTML template
├── src/
│   ├── components/      # React components
│   │   ├── AuthComponent.js
│   │   ├── Dashboard.js
│   │   ├── TransactionForm.js
│   │   └── TransactionList.js
│   ├── services/        # API services
│   │   └── transactionService.js
│   ├── App.js           # Main app component
│   ├── App.css          # App styles
│   ├── index.js         # Entry point
│   └── index.css        # Global styles
├── package.json         # Dependencies
└── README.md           # Documentation
```

## Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note:** This is a one-way operation. Once you eject, you can't go back!

## Development Tips

### 1. Browser DevTools
- Open DevTools (F12 or Cmd+Option+I on Mac)
- Check Console for any errors
- Use Application/Storage tab to view localStorage data

### 2. Hot Reloading
- The development server supports hot reloading
- Save any file to see changes instantly
- If something looks wrong, try refreshing the browser

### 3. Clearing Data
To clear all data in demo mode:
- Open Browser DevTools → Application/Storage → Local Storage
- Clear all localStorage items
- Or use the logout button (clears transactions)

### 4. Responsive Testing
- Use DevTools Device Toolbar (Cmd+Shift+M / Ctrl+Shift+M)
- Test on different device sizes
- The app is fully responsive

## Common Issues and Solutions

### Port Already in Use
If port 3000 is already in use:
```bash
# Option 1: Kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows

# Option 2: Use a different port
PORT=3001 npm start
```

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Clear cache and rebuild
npm run build -- --reset-cache
```

### Browser Cache Issues
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or clear browser cache manually

## Data Storage (Demo Mode)

In demo mode, data is stored in browser localStorage:

- **User accounts**: Stored as `user_<username>`
- **Current user**: Stored as `user`
- **Transactions**: Stored as `transactions`

**Important Notes:**
- Data persists only in the current browser
- Clearing browser data will delete all transactions
- Data is not synchronized across devices
- For production use, deploy to AWS (see AWS_DEPLOYMENT.md)

## Making Changes

### Adding a New Component

1. Create a new file in `src/components/`:
```javascript
// src/components/MyComponent.js
import React from 'react';
import './MyComponent.css';

function MyComponent() {
  return <div>My Component</div>;
}

export default MyComponent;
```

2. Import and use in App.js:
```javascript
import MyComponent from './components/MyComponent';
```

### Modifying Styles

- Component-specific styles: Edit corresponding `.css` file
- Global styles: Edit `src/index.css`
- App-level styles: Edit `src/App.css`

### Adding New Categories

Edit `src/components/TransactionForm.js`:

```javascript
const expenseCategories = [
  'Food & Dining',
  'Your New Category',
  // ... other categories
];
```

## Next Steps

Once you're comfortable with local development:

1. **Deploy to AWS** - Follow [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)
2. **Enable Real Authentication** - Set up AWS Cognito
3. **Connect to Database** - Configure DynamoDB
4. **Set Up API** - Deploy Lambda functions

## Getting Help

- Check the [README.md](./README.md) for general information
- Review [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for deployment help
- Check [API_DOCUMENTATION.md](./docs/api-specs/API_DOCUMENTATION.md) for API details
- Open an issue on GitHub for bugs or feature requests

## Performance Tips

1. **Optimize Images**: Use compressed images if you add any
2. **Code Splitting**: React already does this automatically
3. **Lazy Loading**: Consider lazy loading components if the app grows
4. **Memoization**: Use React.memo for expensive components

## Security Notes

Even in demo mode:
- Passwords are stored in localStorage (not secure for production)
- Never commit sensitive data
- Always use HTTPS in production
- Enable AWS Cognito for production authentication

---

Happy coding! 🚀
