// import { useEffect, useState } from "react";
// import { Lucid, Blockfrost, Data } from "lucid-cardano";

// const BLOCKFROST_API_KEY = "previewu9b4zZs2adPaAxAGFaT83JYxa8TQboiG";
// const BLOCKFROST_URL = "https://cardano-preview.blockfrost.io/api/v0";

// const Healthcare = () => {
//   const [account, setAccount] = useState(null);
//   const [lucid, setLucid] = useState(null);
//   const [patientName, setPatientName] = useState("");
//   const [patientDiseases, setPatientDiseases] = useState("");
//   const [txHash, setTxHash] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (!window.cardano || !window.cardano.eternl) {
//         alert("Please install and unlock Eternl Wallet to use this app.");
//         console.log("window.cardano:", window.cardano);
//         return;
//       }
//       try {
//         console.log("Enabling Eternl wallet...");
//         const api = await window.cardano.eternl.enable();
//         console.log("Eternl API methods:", Object.keys(api));

//         console.log("Testing getUsedAddresses...");
//         const usedAddresses = await api.getUsedAddresses();
//         console.log("Used Addresses:", usedAddresses);

//         console.log("Initializing Lucid with Blockfrost...");
//         const lucidInstance = await Lucid.new(
//           new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
//           "Preview"
//         );
//         console.log("Lucid instance created:", lucidInstance);

//         const protocolParams = await lucidInstance.provider.getProtocolParameters();
//         console.log("Protocol Parameters:", protocolParams);

//         await lucidInstance.selectWallet(api);
//         setLucid(lucidInstance);

//         if (usedAddresses && usedAddresses.length > 0) {
//           const bech32Address = lucidInstance.utils.credentialToAddress(
//             lucidInstance.utils.getAddressDetails(usedAddresses[0]).paymentCredential
//           );
//           console.log("Bech32 Address:", bech32Address);
//           setAccount(bech32Address);
//         } else {
//           const address = await lucidInstance.wallet.address();
//           console.log("Wallet Address:", address);
//           setAccount(address);
//         }
//       } catch (err) {
//         setError("Error connecting to Eternl Wallet: " + err.message);
//         console.error("Error details:", err);
//       }
//     };
//     connectWallet();
//   }, []);

//   const savePatientDetails = async (e) => {
//     e.preventDefault();
//     if (!lucid || !account) {
//       alert("Wallet not connected. Please connect your wallet.");
//       return;
//     }
//     if (!patientName || !patientDiseases) {
//       alert("Please provide patient name and diseases.");
//       return;
//     }

//     try {
//       console.log("Building transaction with Lucid:", lucid);
//       console.log("Account address:", account);

//       // Re-select wallet
//       const api = await window.cardano.eternl.enable();
//       await lucid.selectWallet(api);
//       console.log("Wallet re-selected");

//       // Validate address
//       lucid.utils.getAddressDetails(account);
//       console.log("Address is valid");

//       // Check UTxOs
//       const utxos = await lucid.wallet.getUtxos();
//       console.log("Available UTxOs:", utxos.map(u => ({
//         txHash: u.txHash,
//         outputIndex: u.outputIndex,
//         assets: u.assets,
//       })));
//       if (!utxos || utxos.length === 0) {
//         throw new Error("No UTxOs available in wallet");
//       }
//       const totalLovelace = utxos.reduce((sum, u) => sum + (u.assets?.lovelace || 0n), 0n);
//       console.log("Total Lovelace:", totalLovelace.toString());
//       if (totalLovelace < 1500000n) {
//         throw new Error("Insufficient funds: need at least 1.5M lovelace (1.5 ADA)");
//       }

//       const metadata = {
//         674: {
//           patient: {
//             name: patientName.slice(0, 64),
//             diseases: patientDiseases.split(",").map((d) => d.trim().slice(0, 64)).slice(0, 10),
//           },
//         },
//       };
//       console.log("Metadata:", JSON.stringify(metadata));

//       const tx = await lucid
//         .newTx()
//         .payToAddress(account, { lovelace: 1000000n })
//         .attachMetadata(674, metadata)
//         .complete();

//       const signedTx = await tx.sign().complete();
//       const txHash = await signedTx.submit();

//       setTxHash(txHash);
//       alert(`Transaction submitted! TxHash: ${txHash}`);
//       setPatientName("");
//       setPatientDiseases("");
//     } catch (err) {
//       setError("Error creating transaction: " + err.message);
//       console.error("Error details:", err);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Cardano Healthcare dApp</h1>
//       {account ? (
//         <p>Connected Account: {account.slice(0, 10)}...{account.slice(-10)}</p>
//       ) : (
//         <p>Not connected</p>
//       )}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={savePatientDetails}>
//         <div>
//           <label>Patient Name: </label>
//           <input
//             type="text"
//             value={patientName}
//             onChange={(e) => setPatientName(e.target.value)}
//             placeholder="Enter patient name"
//           />
//         </div>
//         <div>
//           <label>Diseases (comma-separated): </label>
//           <input
//             type="text"
//             value={patientDiseases}
//             onChange={(e) => setPatientDiseases(e.target.value)}
//             placeholder="e.g., Diabetes, Hypertension"
//           />
//         </div>
//         <button type="submit">Save Patient Details</button>
//       </form>
//       {txHash && (
//         <p>
//           Transaction successful!{" "}
//           <a
//             href={`https://preview.cardanoscan.io/transaction/${txHash}`}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             View on Cardanoscan
//           </a>
//         </p>
//       )}
//     </div>
//   );
// };

// export default Healthcare;

// import { useEffect, useState } from "react";
// import { Lucid, Blockfrost } from "lucid-cardano";

// const BLOCKFROST_API_KEY = "previewu9b4zZs2adPaAxAGFaT83JYxa8TQboiG";
// const BLOCKFROST_URL = "https://cardano-preview.blockfrost.io/api/v0";

// const Healthcare = () => {
//   const [account, setAccount] = useState(null);
//   const [lucid, setLucid] = useState(null);
//   const [patientName, setPatientName] = useState("");
//   const [patientDiseases, setPatientDiseases] = useState("");
//   const [txHash, setTxHash] = useState(null);
//   const [error, setError] = useState(null);
//   const [patientDetails, setPatientDetails] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (!window.cardano || !window.cardano.eternl) {
//         alert("Please install and unlock Eternl Wallet to use this app.");
//         return;
//       }
//       try {
//         const api = await window.cardano.eternl.enable();
//         const lucidInstance = await Lucid.new(
//           new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
//           "Preview"
//         );
//         await lucidInstance.selectWallet(api);
//         setLucid(lucidInstance);

//         const address = await lucidInstance.wallet.address();
//         setAccount(address);
//       } catch (err) {
//         setError("Error connecting to Eternl Wallet: " + err.message);
//         console.error(err);
//       }
//     };
//     connectWallet();
//   }, []);

//   const savePatientDetails = async (e) => {
//     e.preventDefault();
//     if (!lucid || !account) {
//       alert("Wallet not connected.");
//       return;
//     }
//     if (!patientName || !patientDiseases) {
//       alert("Provide patient name and diseases.");
//       return;
//     }

//     try {
//       const api = await window.cardano.eternl.enable();
//       await lucid.selectWallet(api);

//       const utxos = await lucid.wallet.getUtxos();
//       if (!utxos || utxos.length === 0) {
//         throw new Error("No UTxOs available in wallet");
//       }

//       const totalLovelace = utxos.reduce((sum, u) => sum + (u.assets?.lovelace || 0n), 0n);
//       if (totalLovelace < 1500000n) {
//         throw new Error("Insufficient funds: need at least 1.5 ADA");
//       }

//       const metadata = {
//         674: {
//           patient: {
//             name: patientName.slice(0, 64),
//             diseases: patientDiseases.split(",").map((d) => d.trim().slice(0, 64)).slice(0, 10),
//           },
//         },
//       };

//       const tx = await lucid
//         .newTx()
//         .payToAddress(account, { lovelace: 1000000n })
//         .attachMetadata(674, metadata)
//         .addSigner(account)
//         .complete();

//       const signedTx = await tx.sign().complete();
//       const txHash = await signedTx.submit();

//       setTxHash(txHash);
//       alert(`Transaction submitted! TxHash: ${txHash}`);
//       setPatientName("");
//       setPatientDiseases("");
//     } catch (err) {
//       setError("Error creating transaction: " + err.message);
//       console.error(err);
//     }
//   };

//   const showPatientDetails = async () => {
//     if (!lucid || !account) {
//       alert("Wallet not connected.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setPatientDetails([]);
//     try {
//       let page = 1;
//       let allTxs = [];
//       let hasMore = true;

//       while (hasMore) {
//         const response = await fetch(
//           `${BLOCKFROST_URL}/addresses/${account}/txs?page=${page}&order=desc`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!response.ok) {
//           throw new Error(`Blockfrost API error: ${response.status}`);
//         }
//         const txs = await response.json();
//         allTxs = [...allTxs, ...txs];
//         hasMore = txs.length === 100;
//         page++;
//       }

//       const patientData = [];
//       for (const txHash of allTxs) {
//         const metadataResponse = await fetch(
//           `${BLOCKFROST_URL}/txs/${txHash}/metadata`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!metadataResponse.ok) continue;
//         const txMetadata = await metadataResponse.json();

//         const txDetails = await fetch(
//           `${BLOCKFROST_URL}/txs/${txHash}`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!txDetails.ok) continue;
//         const txInfo = await txDetails.json();

//         const patientMetadata = txMetadata.find(
//           (m) => m.label === "674" && m.json_metadata?.["674"]?.patient
//         );

//         if (patientMetadata) {
//           const patient = patientMetadata.json_metadata["674"].patient;
//           patientData.push({
//             txHash,
//             metadata: patientMetadata.json_metadata,
//             metadataHash: txInfo.metadata_hash || "N/A",
//             name: patient.name || "N/A",
//             diseases: patient.diseases || [],
//           });
//         }
//       }

//       setPatientDetails(patientData);

//       if (patientData.length === 0) {
//         setError("No patient details found in transactions.");
//       }
//     } catch (err) {
//       setError(`Error fetching patient details: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Cardano Healthcare dApp</h1>
//       {account ? (
//         <p>Connected Account: {account.slice(0, 10)}...{account.slice(-10)}</p>
//       ) : (
//         <p>Not connected</p>
//       )}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={savePatientDetails}>
//         <div>
//           <label>Patient Name: </label>
//           <input
//             type="text"
//             value={patientName}
//             onChange={(e) => setPatientName(e.target.value)}
//             placeholder="Enter patient name"
//           />
//         </div>
//         <div>
//           <label>Diseases (comma-separated): </label>
//           <input
//             type="text"
//             value={patientDiseases}
//             onChange={(e) => setPatientDiseases(e.target.value)}
//             placeholder="e.g., Diabetes, Hypertension"
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           Save Patient Details
//         </button>
//       </form>
//       <button onClick={showPatientDetails} disabled={loading} style={{ marginTop: "10px" }}>
//         {loading ? "Loading..." : "Show Patient Details"}
//       </button>

//       {patientDetails.length > 0 && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Patient Details</h2>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transaction Hash</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Diseases</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Metadata</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Metadata Hash</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patientDetails.map((patient, index) => (
//                 <tr key={index}>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     <a
//                       href={`https://preview.cardanoscan.io/transaction/${patient.txHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {patient.txHash.slice(0, 10)}...
//                     </a>
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>{patient.name}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     {patient.diseases.length > 0 ? patient.diseases.join(", ") : "None"}
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     {JSON.stringify(patient.metadata, null, 2)}
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     {patient.metadataHash}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {txHash && (
//         <p>
//           Transaction successful!{" "}
//           <a
//             href={`https://preview.cardanoscan.io/transaction/${txHash}`}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             View on Cardanoscan
//           </a>
//         </p>
//       )}
//     </div>
//   );
// };

// export default Healthcare;


// import { useEffect, useState } from "react";
// import { Lucid, Blockfrost } from "lucid-cardano";

// const BLOCKFROST_API_KEY = "previewu9b4zZs2adPaAxAGFaT83JYxa8TQboiG";
// const BLOCKFROST_URL = "https://cardano-preview.blockfrost.io/api/v0";

// const Healthcare = () => {
//   const [account, setAccount] = useState(null);
//   const [lucid, setLucid] = useState(null);
//   const [patientName, setPatientName] = useState("");
//   const [patientDiseases, setPatientDiseases] = useState("");
//   const [txHash, setTxHash] = useState(null);
//   const [error, setError] = useState(null);
//   const [patientDetails, setPatientDetails] = useState([]);
//   const [allTransactions, setAllTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (!window.cardano || !window.cardano.eternl) {
//         alert("Please install and unlock Eternl Wallet to use this app.");
//         return;
//       }
//       try {
//         const api = await window.cardano.eternl.enable();
//         const lucidInstance = await Lucid.new(
//           new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
//           "Preview"
//         );
//         await lucidInstance.selectWallet(api);
//         setLucid(lucidInstance);

//         const address = await lucidInstance.wallet.address();
//         setAccount(address);
//       } catch (err) {
//         setError("Error connecting to Eternl Wallet: " + err.message);
//         console.error(err);
//       }
//     };
//     connectWallet();
//   }, []);

//   const savePatientDetails = async (e) => {
//     e.preventDefault();
//     if (!lucid || !account) {
//       alert("Wallet not connected.");
//       return;
//     }
//     if (!patientName || !patientDiseases) {
//       alert("Provide patient name and diseases.");
//       return;
//     }

//     try {
//       const api = await window.cardano.eternl.enable();
//       await lucid.selectWallet(api);

//       const utxos = await lucid.wallet.getUtxos();
//       if (!utxos || utxos.length === 0) {
//         throw new Error("No UTxOs available in wallet");
//       }

//       const totalLovelace = utxos.reduce((sum, u) => sum + (u.assets?.lovelace || 0n), 0n);
//       if (totalLovelace < 1500000n) {
//         throw new Error("Insufficient funds: need at least 1.5 ADA");
//       }

//       const metadata = {
//         674: {
//           patient: {
//             name: patientName.slice(0, 64),
//             diseases: patientDiseases.split(",").map((d) => d.trim().slice(0, 64)).slice(0, 10),
//           },
//         },
//       };

//       const tx = await lucid
//         .newTx()
//         .payToAddress(account, { lovelace: 1000000n })
//         .attachMetadata(674, metadata)
//         .addSigner(account)
//         .complete();

//       const signedTx = await tx.sign().complete();
//       const txHash = await signedTx.submit();

//       setTxHash(txHash);
//       alert(`Transaction submitted! TxHash: ${txHash}`);
//       setPatientName("");
//       setPatientDiseases("");
//     } catch (err) {
//       setError("Error creating transaction: " + err.message);
//       console.error(err);
//     }
//   };

//   const showPatientDetails = async () => {
//     if (!lucid || !account) {
//       alert("Wallet not connected.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setPatientDetails([]);
//     try {
//       let page = 1;
//       let allTxs = [];
//       let hasMore = true;

//       while (hasMore) {
//         const response = await fetch(
//           `${BLOCKFROST_URL}/addresses/${account}/txs?page=${page}&order=desc`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!response.ok) {
//           throw new Error(`Blockfrost API error: ${response.status}`);
//         }
//         const txs = await response.json();
//         allTxs = [...allTxs, ...txs];
//         hasMore = txs.length === 100;
//         page++;
//       }

//       const patientData = [];
//       for (const txHash of allTxs) {
//         const metadataResponse = await fetch(
//           `${BLOCKFROST_URL}/txs/${txHash}/metadata`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!metadataResponse.ok) continue;
//         const txMetadata = await metadataResponse.json();

//         const txDetails = await fetch(
//           `${BLOCKFROST_URL}/txs/${txHash}`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!txDetails.ok) continue;
//         const txInfo = await txDetails.json();

//         const patientMetadata = txMetadata.find(
//           (m) => m.label === "674" && m.json_metadata?.["674"]?.patient
//         );

//         if (patientMetadata) {
//           const patient = patientMetadata.json_metadata["674"].patient;
//           patientData.push({
//             txHash,
//             metadata: patientMetadata.json_metadata,
//             metadataHash: txInfo.metadata_hash || "N/A",
//             name: patient.name || "N/A",
//             diseases: patient.diseases || [],
//           });
//         }
//       }

//       setPatientDetails(patientData);

//       if (patientData.length === 0) {
//         setError("No patient details found in transactions.");
//       }
//     } catch (err) {
//       setError(`Error fetching patient details: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showAllTransactions = async () => {
//     setLoading(true);
//     setError(null);
//     setAllTransactions([]);
//     try {
//       let page = 1;
//       let allTxs = [];
//       let hasMore = true;
//       const maxPages = 10; // Limit to avoid excessive API calls

//       while (hasMore && page <= maxPages) {
//         const response = await fetch(
//           `${BLOCKFROST_URL}/txs?page=${page}&order=desc`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!response.ok) {
//           throw new Error(`Blockfrost API error: ${response.status}`);
//         }
//         const txs = await response.json();
//         allTxs = [...allTxs, ...txs];
//         hasMore = txs.length === 100;
//         page++;
//       }

//       const transactionData = [];
//       for (const txHash of allTxs) {
//         const txDetails = await fetch(
//           `${BLOCKFROST_URL}/txs/${txHash}`,
//           { headers: { project_id: BLOCKFROST_API_KEY } }
//         );
//         if (!txDetails.ok) continue;
//         const txInfo = await txDetails.json();

//         transactionData.push({
//           txHash,
//           block: txInfo.block,
//           slot: txInfo.slot,
//           fees: txInfo.fees || "N/A",
//           outputAmount: txInfo.output_amount?.[0]?.quantity || "N/A",
//         });
//       }

//       setAllTransactions(transactionData);

//       if (transactionData.length === 0) {
//         setError("No transactions found.");
//       }
//     } catch (err) {
//       setError(`Error fetching transactions: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Cardano Healthcare dApp</h1>
//       {account ? (
//         <p>Connected Account: {account.slice(0, 10)}...{account.slice(-10)}</p>
//       ) : (
//         <p>Not connected</p>
//       )}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={savePatientDetails}>
//         <div>
//           <label>Patient Name: </label>
//           <input
//             type="text"
//             value={patientName}
//             onChange={(e) => setPatientName(e.target.value)}
//             placeholder="Enter patient name"
//           />
//         </div>
//         <div>
//           <label>Diseases (comma-separated): </label>
//           <input
//             type="text"
//             value={patientDiseases}
//             onChange={(e) => setPatientDiseases(e.target.value)}
//             placeholder="e.g., Diabetes, Hypertension"
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           Save Patient Details
//         </button>
//       </form>
//       <button onClick={showPatientDetails} disabled={loading} style={{ marginTop: "10px", marginRight: "10px" }}>
//         {loading ? "Loading..." : "Show Patient Details"}
//       </button>
//       <button onClick={showAllTransactions} disabled={loading} style={{ marginTop: "10px" }}>
//         {loading ? "Loading..." : "Show All Transactions"}
//       </button>

//       {patientDetails.length > 0 && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Patient Details</h2>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transaction Hash</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Diseases</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Metadata</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Metadata Hash</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patientDetails.map((patient, index) => (
//                 <tr key={index}>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     <a
//                       href={`https://preview.cardanoscan.io/transaction/${patient.txHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {patient.txHash.slice(0, 10)}...
//                     </a>
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>{patient.name}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     {patient.diseases.length > 0 ? patient.diseases.join(", ") : "None"}
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     {JSON.stringify(patient.metadata, null, 2)}
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     {patient.metadataHash}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {allTransactions.length > 0 && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>All Blockchain Transactions</h2>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transaction Hash</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Block</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Slot</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fees (Lovelace)</th>
//                 <th style={{ border: "1px solid #ddd", padding: "8px" }}>Output Amount (Lovelace)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allTransactions.map((tx, index) => (
//                 <tr key={index}>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                     <a
//                       href={`https://preview.cardanoscan.io/transaction/${tx.txHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {tx.txHash.slice(0, 10)}...
//                     </a>
//                   </td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.block}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.slot}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.fees}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.outputAmount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {txHash && (
//         <p>
//           Transaction successful!{" "}
//           <a
//             href={`https://preview.cardanoscan.io/transaction/${txHash}`}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             View on Cardanoscan
//           </a>
//         </p>
//       )}
//     </div>
//   );
// };

// export default Healthcare;


import { useEffect, useState } from "react";
import { Lucid, Blockfrost } from "lucid-cardano";

const BLOCKFROST_API_KEY = "previewu9b4zZs2adPaAxAGFaT83JYxa8TQboiG"; // Replace with your valid API key
const BLOCKFROST_URL = "https://cardano-preview.blockfrost.io/api/v0";

const Healthcare = () => {
  const [account, setAccount] = useState(null);
  const [lucid, setLucid] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientDiseases, setPatientDiseases] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.cardano || !window.cardano.eternl) {
        alert("Please install and unlock Eternl Wallet to use this app.");
        return;
      }
      try {
        const api = await window.cardano.eternl.enable();
        const lucidInstance = await Lucid.new(
          new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
          "Preview"
        );
        await lucidInstance.selectWallet(api);
        setLucid(lucidInstance);

        const address = await lucidInstance.wallet.address();
        setAccount(address);
      } catch (err) {
        setError("Error connecting to Eternl Wallet: " + err.message);
        console.error(err);
      }
    };
    connectWallet();
  }, []);

  const savePatientDetails = async (e) => {
    e.preventDefault();
    if (!lucid || !account) {
      alert("Wallet not connected.");
      return;
    }
    if (!patientName || !patientDiseases) {
      alert("Provide patient name and diseases.");
      return;
    }

    try {
      const api = await window.cardano.eternl.enable();
      await lucid.selectWallet(api);

      const utxos = await lucid.wallet.getUtxos();
      if (!utxos || utxos.length === 0) {
        throw new Error("No UTxOs available in wallet");
      }

      const totalLovelace = utxos.reduce((sum, u) => sum + (u.assets?.lovelace || 0n), 0n);
      if (totalLovelace < 1500000n) {
        throw new Error("Insufficient funds: need at least 1.5 ADA");
      }

      const metadata = {
        674: {
          patient: {
            name: patientName.slice(0, 64),
            diseases: patientDiseases.split(",").map((d) => d.trim().slice(0, 64)).slice(0, 10),
          },
        },
      };

      const tx = await lucid
        .newTx()
        .payToAddress(account, { lovelace: 1000000n })
        .attachMetadata(674, metadata)
        .addSigner(account)
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      setTxHash(txHash);
      alert(`Transaction submitted! TxHash: ${txHash}`);
      setPatientName("");
      setPatientDiseases("");
    } catch (err) {
      setError("Error creating transaction: " + err.message);
      console.error(err);
    }
  };

  const showAllTransactions = async () => {
    if (!account) {
      alert("Wallet not connected.");
      return;
    }

    setLoading(true);
    setError(null);
    setAllTransactions([]);
    try {
      let page = 1;
      let allTxs = [];
      let hasMore = true;
      const maxPages = 3;

      while (hasMore && page <= maxPages) {
        const response = await fetch(
          `${BLOCKFROST_URL}/addresses/${account}/txs?page=${page}&order=desc`,
          {
            headers: {
              project_id: BLOCKFROST_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Blockfrost API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
        const txs = await response.json();
        allTxs = [...allTxs, ...txs];
        hasMore = txs.length === 100;
        page++;
      }

      const transactionData = [];
      for (const txHash of allTxs) {
        // Fetch transaction details
        const txDetailsRes = await fetch(
          `${BLOCKFROST_URL}/txs/${txHash}`,
          {
            headers: {
              project_id: BLOCKFROST_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        if (!txDetailsRes.ok) continue;
        const txInfo = await txDetailsRes.json();

        // Fetch transaction metadata
        const metadataRes = await fetch(
          `${BLOCKFROST_URL}/txs/${txHash}/metadata`,
          {
            headers: {
              project_id: BLOCKFROST_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        let metadataJson = [];
        if (metadataRes.ok) {
          metadataJson = await metadataRes.json();
        }

        transactionData.push({
          txHash,
          block: txInfo.block,
          slot: txInfo.slot,
          fees: txInfo.fees || "N/A",
          outputAmount: txInfo.output_amount?.[0]?.quantity || "N/A",
          metadata: metadataJson.length > 0 ? metadataJson : "No metadata",
        });
      }

      setAllTransactions(transactionData);

      if (transactionData.length === 0) {
        setError("No transactions found.");
      }
    } catch (err) {
      setError(`Error fetching transactions: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cardano Healthcare dApp</h1>
      {account ? (
        <p>Connected Account: {account.slice(0, 10)}...{account.slice(-10)}</p>
      ) : (
        <p>Not connected</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={savePatientDetails}>
        <div>
          <label>Patient Name: </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
        </div>
        <div>
          <label>Diseases (comma-separated): </label>
          <input
            type="text"
            value={patientDiseases}
            onChange={(e) => setPatientDiseases(e.target.value)}
            placeholder="e.g., Diabetes, Hypertension"
          />
        </div>
        <button type="submit" disabled={loading}>
          Save Patient Details
        </button>
      </form>

      <button onClick={showAllTransactions} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Loading..." : "Show All Transactions"}
      </button>

      {allTransactions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>All Blockchain Transactions</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transaction Hash</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Block</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Slot</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fees (Lovelace)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Output Amount (Lovelace)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.map((tx, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <a
                      href={`https://preview.cardanoscan.io/transaction/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tx.txHash.slice(0, 10)}...
                    </a>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.block}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.slot}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.fees}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{tx.outputAmount}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                      {typeof tx.metadata === "string"
                        ? tx.metadata
                        : JSON.stringify(tx.metadata, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {txHash && (
        <p>
          Transaction successful!{" "}
          <a
            href={`https://preview.cardanoscan.io/transaction/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Cardanoscan
          </a>
        </p>
      )}
    </div>
  );
};

export default Healthcare;
