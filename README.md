# Admin Portal Analytics API

A simple Node.js application using Express.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

### 📦 Installation

```bash
npm install
```

### 🛠️ Deployment Steps

1. **Clone or download the project**  
   Clone or download the project from the GitHub repository:  
   [https://github.com/KrishnanMuthiahPillaiFakeehTech/DMFH-Admin-Portal-Analytics.git](https://github.com/KrishnanMuthiahPillaiFakeehTech/DMFH-Admin-Portal-Analytics.git)

2. **Install dependencies**  
   Run the following command to install the required dependencies:  
   ```bash
   npm install
   ```

3. **Add required configuration files**  
   Place the following files in the project root directory (these are attached in the email):  
   - `config.json`  
     - Ensure you add the `GA4_PROPERTY_ID` inside the `config.json` file.  
   - `service-account.json`  
     - Obtain the `service-account.json` file from the Firebase Cloud Console and place it in the project root directory.

4. **Start the server**  
   Run the application using:  
   ```bash
   node app.js
   ```

## 📂 Project Structure

```
ANALYTICS-API/
├── analytics/
│   ├── activeUsersTrend.js
│   ├── getEventsByName.js
│   ├── getKeyEventsByName.js
│   ├── getMetricByPlatform.js
│   ├── getNewUsersByAtt.js
│   ├── getTrafficAcquisition.js
│   ├── getUsersByCountry.js
│   ├── getUsersByOS.js
│   ├── getUsersByPlatformDeviceCategory.js
│   ├── userMetrics.js
│   └── viewsVSEventCount.js
├── gaClient.js
├── constants/
│   └── routeConstants.js
├── middlewares/
│   ├── asyncHandler.js
│   └── registerRoute.js
├── node_modules/
├── utils/
│   ├── errorHandler.js
│   ├── throttle.js
│   └── utils.js
├── .gitignore
├── app.js
├── config.json
├── package-lock.json
├── package.json
├── README.md
├── routes.js
└── service-account.json
```

## 📦 Dependencies

- `@google-analytics/data@^5.1.0`
- `cors@^2.8.5`
- `date-fns@^4.1.0`
- `express@^5.1.0`
- `p-limit@^2.3.0`
