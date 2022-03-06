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

// If there's no internet, run this if we attempt to submit a budget item
function saveRecord(record) {
    // Open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_budget'], 'readwrite');
    // Access the object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');
    // Add the record to your store
    budgetObjectStore.add(record);
}

// If there is internet, run this to upload a budget item to the server
function uploadRecord() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    const getAll = budgetObjectStore.getAll();

    // If getAll() is successful
    getAll.onsuccess = function() {
        // If there's data in indexDB's store
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // Open another transaction
                const transaction = db.transaction(['new_budget'], 'readwrite');
                // Access the new_budget object store
                const budgetObjectStore = transaction.objectStore('new_budget');
                // Clear out the store
                budgetObjectStore.clear();

                alert('All budget items have been posted to the server.');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// Listen for internet connection to be restored. Upload local storage data if it is.
window.addEventListener('online', uploadRecord);