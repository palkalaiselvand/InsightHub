# Deployment Guide

## Backend: Azure App Service

1. **Build & Publish**
   - Run: `dotnet publish -c Release -o ./publish`
2. **Create Azure App Service**
   - Use Azure Portal or CLI to create a Web App for .NET.
3. **Configure MongoDB Atlas**
   - Set `MongoSettings:ConnectionString` and `DatabaseName` in Azure App Service settings.
4. **Deploy**
   - Use Azure CLI or VS Code Azure extension to deploy the `publish` folder.

## Database: MongoDB Atlas

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster.
2. **Get Connection String**
   - Update `appsettings.json` or Azure App Service settings with your Atlas connection string.

## Frontend: Vercel

1. **Push to GitHub**
   - Ensure your frontend is in a GitHub repo.
2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com/) and import your repo.
3. **Configure Environment Variables**
   - Set `REACT_APP_API_URL` to your Azure backend URL.
4. **Deploy**
   - Vercel will auto-build and deploy.

## CI/CD

- Use GitHub Actions for automated build/test/deploy.
- Example workflow files can be added for both frontend and backend.

## Production Checklist

- Set environment variables securely.
- Enable HTTPS and CORS for frontend/backend.
- Monitor logs and errors via Azure/Vercel dashboards.

---
For detailed scripts and workflow files, see Azure/Vercel documentation or request sample YAML files.
