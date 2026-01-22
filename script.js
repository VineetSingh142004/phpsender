// Email storage
let emails = [];
let currentFilter = 'all';
let selectedEmails = new Set();
let currentViewingEmailId = null;
let currentAttachments = [];

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
            if (!email.attachments) {
                email.attachments = [];
            }
        });
    } else {
        // Initialize with sample emails if no stored emails
        initializeSampleEmails();
    }
}

// Initialize sample emails
function initializeSampleEmails() {
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    // Helper function to create date with offset in days
    const dateOffset = (days) => {
        const d = new Date(lastYear);
        d.setDate(d.getDate() + days);
        d.setHours(Math.floor(Math.random() * 12) + 9, Math.floor(Math.random() * 60), 0, 0);
        return d;
    };

    emails = [
        // University Application Confirmations
        {
            id: '1',
            from: 'admissions@brown.edu',
            to: 'you@gmail.com',
            subject: 'Application Received - Brown University',
            message: 'Dear Applicant,\n\nThank you for submitting your application to Brown University. We have successfully received your application for the Fall 2024 term.\n\nApplication ID: BR-2024-847293\nApplication Type: First-Year\nSubmission Date: ' + dateOffset(-320).toLocaleDateString() + '\n\nYour application is now under review. You will receive updates regarding your application status through this email address. Please ensure that all required materials, including transcripts, test scores, and letters of recommendation, are submitted by the deadline.\n\nYou can track your application status by logging into your applicant portal at apply.brown.edu.\n\nBest regards,\nOffice of College Admission\nBrown University',
            date: dateOffset(-320),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '2',
            from: 'admissions@yale.edu',
            to: 'you@gmail.com',
            subject: 'Yale University - Application Confirmation',
            message: 'Dear Applicant,\n\nThis email confirms that Yale University has received your application for the Class of 2028.\n\nApplication Reference: YU-2024-129847\nApplication Deadline: January 2, 2024\nStatus: Complete and Under Review\n\nYour application materials are being processed. Please note that all supporting documents must be received by the deadline for your application to be considered complete.\n\nWe appreciate your interest in Yale and look forward to reviewing your application.\n\nSincerely,\nYale Office of Undergraduate Admissions',
            date: dateOffset(-315),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '3',
            from: 'admissions@cornell.edu',
            to: 'you@gmail.com',
            subject: 'Cornell University Application Acknowledgment',
            message: 'Dear Student,\n\nThank you for applying to Cornell University. We have received your application for admission to the Fall 2024 entering class.\n\nApplication Number: CU-2024-583927\nCollege/School: College of Arts and Sciences\nApplication Status: Complete\n\nYour application is now in our review process. All required materials have been received and your file is complete.\n\nWe will notify you of our admission decision by early April 2024. In the meantime, please continue to check your email and applicant portal for any updates.\n\nBest wishes,\nCornell University Office of Undergraduate Admissions',
            date: dateOffset(-310),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '4',
            from: 'admissions@harvard.edu',
            to: 'you@gmail.com',
            subject: 'Harvard College Application Received',
            message: 'Dear Applicant,\n\nHarvard College has received your application for the Class of 2028.\n\nApplication ID: HC-2024-472839\nApplication Type: Regular Decision\nSubmission Date: ' + dateOffset(-305).toLocaleDateString() + '\n\nYour application is complete and has been forwarded to the Admissions Committee for review. All required materials, including your Common Application, transcripts, standardized test scores, and letters of recommendation, have been received.\n\nAdmission decisions will be released in late March 2024. You will be notified via email when decisions are available.\n\nThank you for your interest in Harvard College.\n\nSincerely,\nHarvard College Admissions Office',
            date: dateOffset(-305),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '5',
            from: 'admissions@stanford.edu',
            to: 'you@gmail.com',
            subject: 'Stanford University - Application Confirmation',
            message: 'Dear Applicant,\n\nStanford University has received your application for undergraduate admission.\n\nApplication Reference: SU-2024-928475\nStatus: Complete\n\nAll required application materials have been received and your file is complete. Your application will be reviewed by our admissions committee.\n\nDecision notifications will be released in late March 2024. We will contact you via email when decisions are available.\n\nWe appreciate your interest in Stanford and wish you the best of luck in the admissions process.\n\nBest regards,\nStanford Undergraduate Admission',
            date: dateOffset(-300),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '6',
            from: 'admissions@mit.edu',
            to: 'you@gmail.com',
            subject: 'MIT Application Received',
            message: 'Dear Applicant,\n\nThe Massachusetts Institute of Technology has received your application for the Class of 2028.\n\nApplication ID: MIT-2024-384729\nApplication Type: Regular Action\nStatus: Complete\n\nYour application is now under review. All required materials have been received.\n\nAdmission decisions will be released in mid-March 2024. You will receive an email notification when decisions are available.\n\nThank you for applying to MIT.\n\nSincerely,\nMIT Office of Undergraduate Admissions',
            date: dateOffset(-295),
            starred: true,
            read: true,
            attachments: []
        },
        
        // Counselor Emails
        {
            id: '7',
            from: 'sarah.johnson@highschool.edu',
            to: 'you@gmail.com',
            subject: 'Re: College Application Timeline - Important Reminders',
            message: 'Hi there,\n\nI wanted to follow up on our conversation about your college applications. I see you\'ve submitted applications to several excellent universities. Here are some important reminders:\n\n1. Make sure all recommendation letters have been submitted\n2. Double-check that your test scores have been sent to all schools\n3. Complete any supplemental essays that are still pending\n4. Submit financial aid forms (FAFSA and CSS Profile) by the deadlines\n\nI\'m here to help if you have any questions. Let\'s schedule a meeting next week to discuss your application strategy and any concerns you might have.\n\nBest,\nMs. Sarah Johnson\nCollege Counselor',
            date: dateOffset(-290),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '8',
            from: 'sarah.johnson@highschool.edu',
            to: 'you@gmail.com',
            subject: 'Re: Recommendation Letters - Status Update',
            message: 'Hello,\n\nI wanted to update you on the status of your recommendation letters. All three of your recommenders have confirmed that they\'ve submitted their letters to the following universities:\n\n- Brown University ✓\n- Yale University ✓\n- Cornell University ✓\n- Harvard University ✓\n- Stanford University ✓\n- MIT ✓\n\nEverything looks good on that front. Your applications should be complete now. Let me know if you receive any notifications about missing materials.\n\nBest,\nMs. Johnson',
            date: dateOffset(-285),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '9',
            from: 'sarah.johnson@highschool.edu',
            to: 'you@gmail.com',
            subject: 'Interview Preparation - Upcoming University Interviews',
            message: 'Hi,\n\nGreat news! I\'ve heard from a few students that some of the universities you applied to are conducting interviews. Here are some tips for your interviews:\n\n1. Research each university thoroughly\n2. Prepare questions to ask the interviewer\n3. Practice talking about your interests and goals\n4. Be yourself and show genuine enthusiasm\n\nIf you receive interview invitations, please let me know and we can schedule a practice session.\n\nGood luck!\nMs. Johnson',
            date: dateOffset(-250),
            starred: false,
            read: true,
            attachments: []
        },
        
        // Offer Letters
        {
            id: '10',
            from: 'admissions@brown.edu',
            to: 'you@gmail.com',
            subject: 'Congratulations! Admission Decision from Brown University',
            message: 'Dear Student,\n\nCongratulations! On behalf of the Brown University Admission Committee, I am delighted to inform you that you have been admitted to the Class of 2028.\n\nThis is a tremendous achievement, and we are excited about the possibility of welcoming you to our community. Your academic excellence, personal qualities, and potential contributions to Brown stood out among a highly competitive applicant pool.\n\nYour official admission letter and information about next steps, including financial aid (if applicable), will be available in your applicant portal. The deadline to accept your offer of admission is May 1, 2024.\n\nWe look forward to celebrating this achievement with you and hope you will join us at Brown.\n\nCongratulations again!\n\nSincerely,\nLogan Powell\nDean of Admission\nBrown University',
            date: dateOffset(-60),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '11',
            from: 'admissions@yale.edu',
            to: 'you@gmail.com',
            subject: 'Your Yale University Admission Decision',
            message: 'Dear Applicant,\n\nI am pleased to inform you that the Yale University Admissions Committee has voted to offer you admission to the Class of 2028.\n\nThis is an extraordinary accomplishment. You were selected from an exceptionally talented and diverse group of applicants, and we believe you will make significant contributions to the Yale community.\n\nYour admission letter and detailed information about financial aid, housing, and orientation will be available in your applicant portal. You have until May 1, 2024 to accept your offer of admission.\n\nWe are excited about the possibility of welcoming you to Yale and look forward to getting to know you better.\n\nCongratulations!\n\nSincerely,\nJeremiah Quinlan\nDean of Undergraduate Admissions\nYale University',
            date: dateOffset(-58),
            starred: true,
            read: true,
            attachments: []
        },
        {
            id: '12',
            from: 'admissions@cornell.edu',
            to: 'you@gmail.com',
            subject: 'Congratulations! You\'ve Been Admitted to Cornell University',
            message: 'Dear Student,\n\nCongratulations! I am delighted to inform you that you have been admitted to Cornell University\'s College of Arts and Sciences for the Fall 2024 semester.\n\nYour academic achievements, personal qualities, and potential for success at Cornell impressed our admissions committee. We believe you will thrive in our academic community and contribute meaningfully to campus life.\n\nYour official admission packet, including information about financial aid, housing, and next steps, is available in your applicant portal. Please note that the deadline to accept your offer of admission is May 1, 2024.\n\nWe are excited about the possibility of welcoming you to the Cornell community.\n\nCongratulations on this outstanding achievement!\n\nBest regards,\nJonathan Burdick\nVice Provost for Enrollment\nCornell University',
            date: dateOffset(-55),
            starred: true,
            read: true,
            attachments: []
        },
        
        // Random realistic emails
        {
            id: '13',
            from: 'noreply@collegeboard.org',
            to: 'you@gmail.com',
            subject: 'Your SAT Scores Are Available',
            message: 'Your SAT scores from the December 2023 test administration are now available. Log in to your College Board account to view your scores.\n\nTest Date: December 2, 2023\nScore Release: Available Now\n\nView your scores at collegeboard.org',
            date: dateOffset(-280),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '14',
            from: 'support@commonapp.org',
            to: 'you@gmail.com',
            subject: 'Application Submitted Successfully',
            message: 'Your Common Application has been successfully submitted to the following institutions:\n\n- Brown University\n- Yale University\n- Cornell University\n- Harvard University\n- Stanford University\n- MIT\n\nAll required materials have been transmitted. Please check with each institution to confirm receipt of all application components.',
            date: dateOffset(-318),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '15',
            from: 'financialaid@brown.edu',
            to: 'you@gmail.com',
            subject: 'Financial Aid Application - Action Required',
            message: 'Dear Student,\n\nWe have received your application for admission to Brown University. To be considered for need-based financial aid, you must complete the following:\n\n1. FAFSA (Free Application for Federal Student Aid)\n2. CSS Profile\n3. Tax documents (if requested)\n\nThe deadline for financial aid applications is February 1, 2024. Please ensure all required documents are submitted by this date.\n\nIf you have any questions, please contact our Financial Aid Office.\n\nBest regards,\nBrown University Financial Aid Office',
            date: dateOffset(-270),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '16',
            from: 'sarah.johnson@highschool.edu',
            to: 'you@gmail.com',
            subject: 'Re: Decision Day - Next Steps',
            message: 'Hi,\n\nI wanted to check in as we approach decision day (May 1st). I know you\'ve received some great offers! Here are some things to consider:\n\n1. Compare financial aid packages\n2. Visit campuses if possible (or attend virtual events)\n3. Think about which school feels like the best fit\n4. Don\'t forget to decline offers from schools you won\'t be attending\n\nI\'m here to help you make this important decision. Let\'s schedule a time to talk through your options.\n\nBest,\nMs. Johnson',
            date: dateOffset(-45),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '17',
            from: 'admissions@harvard.edu',
            to: 'you@gmail.com',
            subject: 'Harvard College Admission Decision',
            message: 'Dear Applicant,\n\nAfter careful consideration of your application, the Harvard College Admissions Committee has completed its review process.\n\nWe regret to inform you that we are unable to offer you admission to the Class of 2028. This decision reflects the extraordinary strength of our applicant pool and the limited number of spaces available, not a judgment of your abilities or potential.\n\nWe received over 57,000 applications for approximately 2,000 places in the entering class. The vast majority of applicants were highly qualified, making our decisions extremely difficult.\n\nWe wish you the very best in your college journey and future endeavors.\n\nSincerely,\nHarvard College Admissions Office',
            date: dateOffset(-52),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '18',
            from: 'admissions@stanford.edu',
            to: 'you@gmail.com',
            subject: 'Stanford University Admission Decision',
            message: 'Dear Applicant,\n\nThank you for your interest in Stanford University. After careful review of your application, we are unable to offer you admission to the Class of 2028.\n\nThis was an exceptionally competitive year, with over 55,000 applications for approximately 2,100 places. The strength of our applicant pool made our decisions extremely difficult.\n\nWe appreciate the time and effort you invested in your application, and we wish you success in your academic pursuits.\n\nBest regards,\nStanford Undergraduate Admission',
            date: dateOffset(-50),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '19',
            from: 'admissions@mit.edu',
            to: 'you@gmail.com',
            subject: 'MIT Admission Decision',
            message: 'Dear Applicant,\n\nThank you for applying to the Massachusetts Institute of Technology. After careful consideration, we are unable to offer you admission to the Class of 2028.\n\nThis was an extremely competitive admissions cycle, and we received applications from many outstanding students. We recognize the significant effort you put into your application.\n\nWe wish you all the best in your future academic and professional endeavors.\n\nSincerely,\nMIT Office of Undergraduate Admissions',
            date: dateOffset(-48),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '20',
            from: 'housing@brown.edu',
            to: 'you@gmail.com',
            subject: 'Welcome to Brown - Housing Application Now Open',
            message: 'Dear Admitted Student,\n\nCongratulations on your admission to Brown University! We\'re excited to welcome you to our community.\n\nThe housing application for the Class of 2028 is now open. All first-year students are required to live on campus. Please complete your housing application by May 15, 2024.\n\nYou can access the housing application through your applicant portal. If you have questions about housing options, roommates, or the application process, please don\'t hesitate to contact us.\n\nWelcome to Brown!\n\nBest regards,\nBrown University Residential Life',
            date: dateOffset(-40),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '21',
            from: 'orientation@yale.edu',
            to: 'you@gmail.com',
            subject: 'Yale Orientation 2024 - Save the Date',
            message: 'Dear Admitted Student,\n\nWelcome to Yale! We\'re thrilled that you\'ll be joining the Class of 2028.\n\nOrientation for the Class of 2024 will take place from August 25-29, 2024. This is a required program for all incoming first-year students. You\'ll receive detailed information about orientation activities, registration, and what to expect in the coming weeks.\n\nIn the meantime, please mark these dates on your calendar. We look forward to welcoming you to campus!\n\nBest,\nYale College Dean\'s Office',
            date: dateOffset(-35),
            starred: false,
            read: true,
            attachments: []
        },
        {
            id: '22',
            from: 'registrar@cornell.edu',
            to: 'you@gmail.com',
            subject: 'Course Registration Information - Cornell University',
            message: 'Dear New Student,\n\nWelcome to Cornell University! Course registration for incoming first-year students will open on June 15, 2024.\n\nBefore you can register, you\'ll need to:\n1. Complete your placement exams (if required)\n2. Meet with your academic advisor\n3. Review the course catalog\n\nMore information will be sent to you in the coming weeks. If you have questions, please contact the Registrar\'s Office.\n\nBest regards,\nCornell University Registrar\'s Office',
            date: dateOffset(-30),
            starred: false,
            read: true,
            attachments: []
        }
    ];

    // Sort by date (newest first)
    emails.sort((a, b) => b.date - a.date);
    saveEmails();
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

    // Back button
    document.getElementById('backBtn').addEventListener('click', () => {
        closeEmailView();
    });

    // View panel buttons
    document.getElementById('viewEditBtn').addEventListener('click', () => {
        if (currentViewingEmailId) {
            const email = emails.find(e => e.id === currentViewingEmailId);
            if (email) {
                openEmailModal(email);
            }
        }
    });

    document.getElementById('viewDeleteBtn').addEventListener('click', () => {
        if (currentViewingEmailId) {
            deleteEmail(currentViewingEmailId);
            closeEmailView();
        }
    });

    document.getElementById('viewStarBtn').addEventListener('click', () => {
        if (currentViewingEmailId) {
            toggleStar(currentViewingEmailId);
            renderEmailView(currentViewingEmailId);
        }
    });

    // Attachment input
    document.getElementById('attachmentInput').addEventListener('change', handleAttachmentUpload);
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
    
    currentAttachments = [];
    renderAttachmentsList();
    
    if (email) {
        title.textContent = 'Edit Email';
        document.getElementById('emailId').value = email.id;
        document.getElementById('fromEmail').value = email.from;
        document.getElementById('toEmail').value = email.to;
        document.getElementById('subject').value = email.subject;
        document.getElementById('message').value = email.message;
        document.getElementById('emailDate').value = formatDateTimeLocal(email.date);
        if (email.attachments && email.attachments.length > 0) {
            currentAttachments = [...email.attachments];
            renderAttachmentsList();
        }
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
    currentAttachments = [];
    renderAttachmentsList();
    selectedEmails.clear();
    renderEmails();
    if (currentViewingEmailId) {
        renderEmailView(currentViewingEmailId);
    }
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
                date,
                attachments: [...currentAttachments]
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
            read: false,
            attachments: [...currentAttachments]
        };
        emails.push(newEmail);
    }

    // Sort emails by date (newest first)
    emails.sort((a, b) => b.date - a.date);
    
    saveEmails();
    closeEmailModal();
    renderEmails();
    if (currentViewingEmailId === id) {
        renderEmailView(id);
    }
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
        <div class="email-item ${selectedEmails.has(email.id) ? 'selected' : ''} ${!email.read ? 'unread' : ''}" 
             data-id="${email.id}" onclick="viewEmail('${email.id}')">
            <input type="checkbox" class="email-checkbox" ${selectedEmails.has(email.id) ? 'checked' : ''} 
                   onclick="event.stopPropagation(); toggleEmailSelection('${email.id}')">
            <span class="material-icons email-star ${email.starred ? 'starred' : ''}" 
                  onclick="event.stopPropagation(); toggleStar('${email.id}')" style="cursor: pointer;">${email.starred ? 'star' : 'star_border'}</span>
            <div class="email-sender">${escapeHtml(email.from)}</div>
            <div class="email-subject">${escapeHtml(email.subject)}</div>
            <div class="email-preview">${escapeHtml(email.message.substring(0, 50))}${email.message.length > 50 ? '...' : ''}</div>
            ${email.attachments && email.attachments.length > 0 ? '<span class="material-icons" style="font-size: 16px; color: #5f6368;">attach_file</span>' : ''}
            <div class="email-date">${formatDate(email.date)}</div>
            <div class="email-actions" onclick="event.stopPropagation();">
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

// View email
function viewEmail(id) {
    currentViewingEmailId = id;
    const email = emails.find(e => e.id === id);
    if (email) {
        email.read = true;
        saveEmails();
        renderEmails();
        renderEmailView(id);
    }
}

// Render email view
function renderEmailView(id) {
    const email = emails.find(e => e.id === id);
    if (!email) return;

    const viewContent = document.getElementById('emailViewContent');
    const starBtn = document.getElementById('viewStarBtn');
    
    // Update star button
    starBtn.innerHTML = email.starred ? '<span class="material-icons">star</span>' : '<span class="material-icons">star_border</span>';
    starBtn.title = email.starred ? 'Unstar' : 'Star';

    const attachmentsHtml = email.attachments && email.attachments.length > 0 ? `
        <div class="email-attachments">
            <div class="email-attachments-title">
                <span class="material-icons">attach_file</span>
                <span>${email.attachments.length} attachment${email.attachments.length > 1 ? 's' : ''}</span>
            </div>
            ${email.attachments.map((att, idx) => {
                if (att.type && att.type.startsWith('image/')) {
                    return `
                        <div class="attachment-item">
                            <div class="attachment-icon">
                                <span class="material-icons">image</span>
                            </div>
                            <div class="attachment-info">
                                <div class="attachment-name">${escapeHtml(att.name)}</div>
                                <div class="attachment-size">${formatFileSize(att.size)}</div>
                                <img src="${att.data}" alt="${escapeHtml(att.name)}" class="attachment-preview" onclick="window.open('${att.data}', '_blank')">
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="attachment-item">
                            <div class="attachment-icon">
                                <span class="material-icons">description</span>
                            </div>
                            <div class="attachment-info">
                                <div class="attachment-name">${escapeHtml(att.name)}</div>
                                <div class="attachment-size">${formatFileSize(att.size)}</div>
                            </div>
                            <div class="attachment-actions">
                                <a href="${att.data}" download="${escapeHtml(att.name)}" class="attachment-delete-btn" title="Download">
                                    <span class="material-icons">download</span>
                                </a>
                            </div>
                        </div>
                    `;
                }
            }).join('')}
        </div>
    ` : '';

    viewContent.innerHTML = `
        <div class="email-view-header-content">
            <input type="text" class="email-view-subject" value="${escapeHtml(email.subject)}" 
                   onblur="saveEmailField('${id}', 'subject', this.value)">
            <div class="email-view-meta">
                <div class="email-view-meta-row">
                    <span class="email-view-meta-label">From:</span>
                    <input type="text" class="email-view-meta-value" value="${escapeHtml(email.from)}" 
                           onblur="saveEmailField('${id}', 'from', this.value)">
                </div>
                <div class="email-view-meta-row">
                    <span class="email-view-meta-label">To:</span>
                    <input type="text" class="email-view-meta-value" value="${escapeHtml(email.to)}" 
                           onblur="saveEmailField('${id}', 'to', this.value)">
                </div>
                <div class="email-view-meta-row">
                    <span class="email-view-meta-label">Date:</span>
                    <input type="datetime-local" class="email-view-meta-value" value="${formatDateTimeLocal(email.date)}" 
                           onchange="saveEmailField('${id}', 'date', new Date(this.value))">
                </div>
            </div>
        </div>
        <div class="email-view-body" contenteditable="true" 
             onblur="saveEmailField('${id}', 'message', this.textContent)">
            ${escapeHtml(email.message)}
        </div>
        ${attachmentsHtml}
    `;
}

// Close email view
function closeEmailView() {
    currentViewingEmailId = null;
    const viewContent = document.getElementById('emailViewContent');
    viewContent.innerHTML = `
        <div class="empty-state">
            <span class="material-icons">mail_outline</span>
            <p>Select an email to view</p>
        </div>
    `;
    document.getElementById('backBtn').style.display = 'none';
}

// Save email field
function saveEmailField(id, field, value) {
    const email = emails.find(e => e.id === id);
    if (email) {
        if (field === 'date') {
            email.date = value;
        } else {
            email[field] = value;
        }
        emails.sort((a, b) => b.date - a.date);
        saveEmails();
        renderEmails();
    }
}

// Handle attachment upload
function handleAttachmentUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const attachment = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: event.target.result
            };
            currentAttachments.push(attachment);
            renderAttachmentsList();
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
}

// Render attachments list in form
function renderAttachmentsList() {
    const list = document.getElementById('attachmentsList');
    if (currentAttachments.length === 0) {
        list.innerHTML = '';
        return;
    }
    
    list.innerHTML = currentAttachments.map((att, idx) => {
        if (att.type && att.type.startsWith('image/')) {
            return `
                <div class="attachment-preview-item">
                    <img src="${att.data}" alt="${escapeHtml(att.name)}">
                    <div class="attachment-preview-info">
                        <div class="attachment-preview-name">${escapeHtml(att.name)}</div>
                        <div class="attachment-preview-size">${formatFileSize(att.size)}</div>
                    </div>
                    <button type="button" class="attachment-remove-btn" onclick="removeAttachment(${idx})">
                        <span class="material-icons">close</span>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="attachment-preview-item">
                    <div class="attachment-icon">
                        <span class="material-icons">description</span>
                    </div>
                    <div class="attachment-preview-info">
                        <div class="attachment-preview-name">${escapeHtml(att.name)}</div>
                        <div class="attachment-preview-size">${formatFileSize(att.size)}</div>
                    </div>
                    <button type="button" class="attachment-remove-btn" onclick="removeAttachment(${idx})">
                        <span class="material-icons">close</span>
                    </button>
                </div>
            `;
        }
    }).join('');
}

// Remove attachment
function removeAttachment(index) {
    currentAttachments.splice(index, 1);
    renderAttachmentsList();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Make functions globally available for onclick handlers
window.toggleEmailSelection = toggleEmailSelection;
window.toggleStar = toggleStar;
window.editEmail = editEmail;
window.deleteEmail = deleteEmail;
window.viewEmail = viewEmail;
window.saveEmailField = saveEmailField;
window.removeAttachment = removeAttachment;