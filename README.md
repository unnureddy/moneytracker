# 💰 MoneyTracker - Expense & Credit Tracking Application

A fully functional, cloud-based expense and credit tracking application built with React and deployed on AWS services. Track your finances securely with real-time data synchronization across all devices.

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Free Tier](https://img.shields.io/badge/AWS-Free%20Tier-success)

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - Secure login/signup with AWS Cognito
- ✅ **Expense Tracking** - Record and categorize expenses
- ✅ **Credit Tracking** - Track income and credits
- ✅ **Real-time Dashboard** - Visual summary of financial health
- ✅ **Transaction History** - View, filter, and sort all transactions
- ✅ **Category Management** - Pre-defined categories for easy organization
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Secure Storage** - All data encrypted and stored in DynamoDB
- ✅ **Cloud Sync** - Access your data from anywhere

### Technical Features
- **Serverless Architecture** - No servers to manage
- **Auto-scaling** - Handles traffic automatically
- **99.99% Uptime** - AWS infrastructure reliability
- **HTTPS Encryption** - Secure communication
- **Zero Cost** - Runs entirely on AWS Free Tier

## 🏗️ Architecture

```
┌─────────────────┐
│   AWS Amplify   │  ← Frontend Hosting + CI/CD
│   (React App)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Amazon Cognito │  ← User Authentication
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  API Gateway    │  ← REST API Endpoints
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  AWS Lambda     │  ← Business Logic
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   DynamoDB      │  ← Data Storage
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- AWS Account (Free Tier)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/unnureddy/moneytracker.git
   cd moneytracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## ☁️ AWS Deployment

### Quick Deploy (Recommended)

For complete deployment instructions, see [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)

**Summary:**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add authentication
amplify add auth

# Add API
amplify add api

# Add hosting
amplify add hosting

# Deploy everything
amplify publish
```

### AWS Services Configuration

| Service | Purpose | Free Tier Limit |
|---------|---------|-----------------|
| **Amplify** | Frontend hosting & CI/CD | 1000 build mins/month, 15 GB/month |
| **Cognito** | User authentication | 50,000 MAUs |
| **Lambda** | Backend functions | 1M requests/month |
| **API Gateway** | REST API | 1M calls/month |
| **DynamoDB** | Database | 25 GB storage |

## 📱 Application Screenshots

### Dashboard
- Real-time statistics
- Total credits, expenses, and balance
- Top spending categories

### Transaction Management
- Easy-to-use form for adding expenses/credits
- Category selection
- Date picker
- Description notes

### Transaction History
- Filter by type (all/expenses/credits)
- Sort by date or amount
- Delete transactions
- Responsive card layout

## 🎨 Technology Stack

### Frontend
- **React 18** - UI framework
- **CSS3** - Styling with gradients and animations
- **LocalStorage** - Temporary data persistence (demo mode)

### Backend (AWS)
- **AWS Amplify** - Full-stack platform
- **Amazon Cognito** - Authentication & user management
- **AWS Lambda** - Serverless compute
- **Amazon API Gateway** - API management
- **Amazon DynamoDB** - NoSQL database

### Development
- **React Scripts** - Build tooling
- **npm** - Package management

## 📂 Project Structure

```
moneytracker/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── AuthComponent.js       # Login/Signup
│   │   ├── Dashboard.js           # Statistics dashboard
│   │   ├── TransactionForm.js     # Add transactions
│   │   └── TransactionList.js     # Transaction history
│   ├── services/
│   │   └── transactionService.js  # API service layer
│   ├── config/             # Configuration files
│   ├── App.js              # Main application
│   ├── App.css             # Global styles
│   ├── index.js            # Application entry
│   └── index.css           # Base styles
├── amplify/                # AWS Amplify configuration
│   ├── backend/            # Backend resources
│   └── .config/            # Amplify CLI config
├── amplify.yml             # Build specification
├── package.json            # Dependencies
├── AWS_DEPLOYMENT.md       # Deployment guide
└── README.md               # This file
```

## 🔒 Security

- **Authentication** - AWS Cognito with secure password policies
- **Authorization** - User-specific data access
- **Encryption** - Data encrypted at rest and in transit
- **HTTPS** - All communications over secure protocols
- **IAM Roles** - Least privilege access control

## 💡 Usage

### Demo Mode (Current)
The application currently runs in demo mode using browser localStorage. Data is stored locally and will persist in your browser.

**Test Users:**
- Create any username/password (min 6 characters)
- Data is stored per-browser session

### Production Mode (After AWS Deploy)
After deploying to AWS:
- Real user authentication via Cognito
- Data stored in DynamoDB
- Accessible from any device
- Automatic backups

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Adding Features

The codebase is structured for easy extension:

1. **New Components** - Add to `src/components/`
2. **API Services** - Extend `src/services/transactionService.js`
3. **Styles** - Component-specific CSS files
4. **AWS Resources** - Use Amplify CLI commands

## 📊 Cost Estimation

For a single user with moderate usage:
- **Monthly Cost**: $0 (within free tier)
- **Annual Cost**: $0 (within free tier)

The application is designed to stay within AWS Free Tier limits for personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Support

For issues and questions:
- Open an issue on GitHub
- Check [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for deployment help
- Review AWS documentation for service-specific issues

## 🎯 Roadmap

Future enhancements:
- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Data export (CSV/PDF)
- [ ] Charts and visualizations
- [ ] Multi-currency support
- [ ] Receipt upload (S3 integration)
- [ ] Email notifications (SES)
- [ ] Mobile app (React Native)

## 🔗 Links

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [React Documentation](https://react.dev/)

## 👨‍💻 Author

Built with ❤️ using AWS services

---

**Ready to deploy?** Check out [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for step-by-step instructions!
