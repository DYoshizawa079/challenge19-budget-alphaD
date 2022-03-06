let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    // Make a new object store (table). Set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_budget', { autoIncrement: true });
};

// When request is successful
request.onsuccess = function(event) {
    db = event.target.result;
  
    // check if app is online
    if (navigator.onLine) {
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a budget item w/o a internet connection
function saveRecord(record) {
    // Open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_budget'], 'readwrite');
    // Access the object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');
    // Add the record to your store
    budgetObjectStore.add(record);
}