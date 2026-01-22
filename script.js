// Email storage
let emails = [];
let currentFilter = 'all';
let selectedEmails = new Set();

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadEmails();
    setupEventListeners();
    renderEmails();
    updateInboxCount();
    
    // Set default date to current date/time
    const dateInput = document.getElementById('emailDate');
    const now = new Date();
    dateInput.value = formatDateTimeLocal(now);
});

// Load emails from localStorage
function loadEmails() {
    const stored = localStorage.getItem('emails');
    if (stored) {
        emails = JSON.parse(stored);
        // Convert date strings back to Date objects for sorting
        emails.forEach(email => {
            email.date = new Date(email.date);
        });
    }
}

// Save emails to localStorage
function saveEmails() {
    localStorage.setItem('emails', JSON.stringify(emails));
    updateInboxCount();
}

// Setup event listeners
function setupEventListeners() {
    // Compose button
    document.getElementById('composeBtn').addEventListener('click', () => {
        openEmailModal();
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeEmailModal);
    document.getElementById('cancelBtn').addEventListener('click', closeEmailModal);
    document.getElementById('emailModal').addEventListener('click', (e) => {
        if (e.target.id === 'emailModal') {
            closeEmailModal();
        }
    });

    // Form submit
    document.getElementById('emailForm').addEventListener('submit', handleEmailSubmit);

    // Navigation filters
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            currentFilter = item.dataset.filter;
            renderEmails();
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderEmails(e.target.value);
    });

    // Select all
    document.getElementById('selectAllBtn').addEventListener('click', toggleSelectAll);

    // Delete button
    document.getElementById('deleteBtn').addEventListener('click', deleteSelectedEmails);

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        renderEmails();
    });
}

// Format date for datetime-local input
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Format date for display
function formatDate(date) {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (diffDays < 365) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Open email modal
function openEmailModal(email = null) {
    const modal = document.getElementById('emailModal');
    const form = document.getElementById('emailForm');
    const title = document.getElementById('modalTitle');
    
    if (email) {
        title.textContent = 'Edit Email';
        document.getElementById('emailId').value = email.id;
        document.getElementById('fromEmail').value = email.from;
        document.getElementById('toEmail').value = email.to;
        document.getElementById('subject').value = email.subject;
        document.getElementById('message').value = email.message;
        document.getElementById('emailDate').value = formatDateTimeLocal(email.date);
    } else {
        title.textContent = 'New Message';
        form.reset();
        document.getElementById('emailId').value = '';
        document.getElementById('fromEmail').value = 'you@gmail.com';
        const dateInput = document.getElementById('emailDate');
        dateInput.value = formatDateTimeLocal(new Date());
    }
    
    modal.classList.add('active');
}

// Close email modal
function closeEmailModal() {
    document.getElementById('emailModal').classList.remove('active');
    document.getElementById('emailForm').reset();
    selectedEmails.clear();
    renderEmails();
}

// Handle email form submit
function handleEmailSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('emailId').value;
    const from = document.getElementById('fromEmail').value;
    const to = document.getElementById('toEmail').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const dateStr = document.getElementById('emailDate').value;
    const date = new Date(dateStr);

    if (id) {
        // Edit existing email
        const index = emails.findIndex(email => email.id === id);
        if (index !== -1) {
            emails[index] = {
                ...emails[index],
                from,
                to,
                subject,
                message,
                date
            };
        }
    } else {
        // Add new email
        const newEmail = {
            id: Date.now().toString(),
            from,
            to,
            subject,
            message,
            date,
            starred: false,
            read: false
        };
        emails.push(newEmail);
    }

    // Sort emails by date (newest first)
    emails.sort((a, b) => b.date - a.date);
    
    saveEmails();
    closeEmailModal();
    renderEmails();
}

// Render emails
function renderEmails(searchTerm = '') {
    const emailList = document.getElementById('emailList');
    let filteredEmails = [...emails];

    // Apply filter
    if (currentFilter === 'starred') {
        filteredEmails = filteredEmails.filter(email => email.starred);
    } else if (currentFilter === 'sent') {
        // For sent emails, we'll show emails where "from" is the user
        filteredEmails = filteredEmails.filter(email => 
            email.from.toLowerCase().includes('you@gmail.com') || 
            email.from.toLowerCase().includes('your-email')
        );
    } else if (currentFilter === 'drafts') {
        // Drafts would be emails not yet sent, but for simplicity, we'll skip this
        filteredEmails = [];
    }

    // Apply search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredEmails = filteredEmails.filter(email =>
            email.from.toLowerCase().includes(term) ||
            email.to.toLowerCase().includes(term) ||
            email.subject.toLowerCase().includes(term) ||
            email.message.toLowerCase().includes(term)
        );
    }

    if (filteredEmails.length === 0) {
        emailList.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">inbox</span>
                <p>No emails found</p>
            </div>
        `;
        return;
    }

    emailList.innerHTML = filteredEmails.map(email => `
        <div class="email-item ${selectedEmails.has(email.id) ? 'selected' : ''}" data-id="${email.id}">
            <input type="checkbox" class="email-checkbox" ${selectedEmails.has(email.id) ? 'checked' : ''} 
                   onchange="toggleEmailSelection('${email.id}')">
            <span class="material-icons email-star ${email.starred ? 'starred' : ''}" 
                  onclick="toggleStar('${email.id}')" style="cursor: pointer;">${email.starred ? 'star' : 'star_border'}</span>
            <div class="email-sender">${escapeHtml(email.from)}</div>
            <div class="email-subject">${escapeHtml(email.subject)}</div>
            <div class="email-preview">${escapeHtml(email.message.substring(0, 50))}${email.message.length > 50 ? '...' : ''}</div>
            <div class="email-date">${formatDate(email.date)}</div>
            <div class="email-actions">
                <button class="email-action-btn" onclick="editEmail('${email.id}')" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="email-action-btn" onclick="deleteEmail('${email.id}')" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle email selection
function toggleEmailSelection(id) {
    if (selectedEmails.has(id)) {
        selectedEmails.delete(id);
    } else {
        selectedEmails.add(id);
    }
    renderEmails();
}

// Toggle select all
function toggleSelectAll() {
    const emailList = document.getElementById('emailList');
    const emailItems = emailList.querySelectorAll('.email-item');
    
    if (selectedEmails.size === emailItems.length) {
        selectedEmails.clear();
    } else {
        emailItems.forEach(item => {
            selectedEmails.add(item.dataset.id);
        });
    }
    renderEmails();
}

// Toggle star
function toggleStar(id) {
    const email = emails.find(e => e.id === id);
    if (email) {
        email.starred = !email.starred;
        saveEmails();
        renderEmails();
    }
}

// Edit email
function editEmail(id) {
    const email = emails.find(e => e.id === id);
    if (email) {
        openEmailModal(email);
    }
}

// Delete email
function deleteEmail(id) {
    if (confirm('Are you sure you want to delete this email?')) {
        emails = emails.filter(e => e.id !== id);
        selectedEmails.delete(id);
        saveEmails();
        renderEmails();
    }
}

// Delete selected emails
function deleteSelectedEmails() {
    if (selectedEmails.size === 0) {
        alert('Please select emails to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedEmails.size} email(s)?`)) {
        emails = emails.filter(e => !selectedEmails.has(e.id));
        selectedEmails.clear();
        saveEmails();
        renderEmails();
    }
}

// Update inbox count
function updateInboxCount() {
    const inboxCount = emails.length;
    document.getElementById('inboxCount').textContent = inboxCount;
}

// Make functions globally available for onclick handlers
window.toggleEmailSelection = toggleEmailSelection;
window.toggleStar = toggleStar;
window.editEmail = editEmail;
window.deleteEmail = deleteEmail;
