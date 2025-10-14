# 🚀 Quick Start Guide

Get MoneyTracker running in 5 minutes!

## Option 1: Local Demo (Fastest)

### Step 1: Clone and Install
```bash
git clone https://github.com/unnureddy/moneytracker.git
cd moneytracker
npm install
```

### Step 2: Run
```bash
npm start
```

### Step 3: Use the App
1. Browser opens automatically at `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Start adding transactions!

**Note**: Demo mode uses browser localStorage. Data persists in your browser only.

---

## Option 2: Deploy to AWS (Production)

### Prerequisites
- AWS Account (Free Tier)
- AWS CLI configured
- Amplify CLI installed

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify
```bash
cd moneytracker
amplify init
```

Answer prompts:
- Project name: `moneytracker`
- Environment: `dev`
- Default editor: (your choice)
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Distribution directory: `build`
- Build command: `npm run build`
- Start command: `npm start`
- Use AWS profile: `Yes`

### Step 3: Add Authentication
```bash
amplify add auth
```

Choose: `Default configuration`

### Step 4: Add API
```bash
amplify add api
```

- Service: `REST`
- API name: `transactionapi`
- Path: `/transactions`
- Lambda source: `Create new function`
- Function name: `transactionFunction`
- Runtime: `NodeJS`
- Template: `CRUD function for DynamoDB`
- Table name: `transactionTable`

### Step 5: Deploy
```bash
amplify push
```

This will:
- ✅ Create Cognito user pool
- ✅ Create Lambda function
- ✅ Create DynamoDB table
- ✅ Set up API Gateway
- ✅ Generate `aws-exports.js`

### Step 6: Update Code (See AWS_DEPLOYMENT.md for details)

Update `src/index.js`:
```javascript
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);
```

### Step 7: Publish
```bash
amplify add hosting
amplify publish
```

Your app is now live! 🎉

---

## Option 3: Deploy via Amplify Console (Easiest Cloud Deploy)

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Connect to Amplify
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Select GitHub
4. Choose your repository
5. Amplify auto-detects `amplify.yml`
6. Click "Save and deploy"

### Step 3: Automatic Deployments
Every `git push` triggers auto-deployment! 🚀

---

## 📋 Quick Reference

### Demo User (Local)
- Create any username/password
- Minimum 6 characters for password

### Available Categories

**Expenses:**
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Other

**Credits:**
- Salary
- Freelance
- Investment
- Gift
- Refund
- Other Income

### Keyboard Shortcuts
- `Tab` - Navigate between fields
- `Enter` - Submit form
- `Escape` - Cancel/Close

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### AWS Amplify Errors
```bash
amplify delete
amplify init
```

### Clear Demo Data
- Open DevTools (F12)
- Application → Local Storage
- Clear all items

---

## 📚 Next Steps

1. ✅ **Try Demo Mode** - Get familiar with features
2. ✅ **Read Documentation** - Check [README.md](./README.md)
3. ✅ **Deploy to AWS** - Follow [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)
4. ✅ **Customize** - Add your own features

---

## 🔗 Helpful Links

- [React Documentation](https://react.dev/)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/)
- [Cognito Guide](https://docs.aws.amazon.com/cognito/)

---

## 💡 Tips

- **Start Local** - Test features before deploying
- **Monitor Costs** - Set up AWS billing alerts
- **Backup Data** - Export important transactions
- **Stay Updated** - Check for updates regularly

---

**Questions?** Open an issue on GitHub or check the full documentation.

Happy tracking! 💰
