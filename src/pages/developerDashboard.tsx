// import { useState } from "react";
// import  ApiKeyGenerator from "../components/developerDashboard/apiKeyGenerator"
// import ApiDocumentation from "../components/developerDashboard/apiKeyDocs";
// import ApiKeyList from "../components/developerDashboard/apiKeyList";

// const DeveloperDashboard: React.FC = () => {
//   const [refreshKeys, setRefreshKeys] = useState(0);

//   return (
//     <div className="space-y-8">
//       <ApiKeyGenerator onKeyGenerated={() => setRefreshKeys(prev => prev + 1)} />
//       <div key={refreshKeys}>
//         <ApiKeyList />
//       </div>
//       <ApiDocumentation />
//     </div>
//   );
// };
// export default DeveloperDashboard;