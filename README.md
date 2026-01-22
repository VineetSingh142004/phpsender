# Gmail Clone - Email Manager

A Gmail-like interface that allows you to create, edit, and manage emails with custom dates. Perfect for demonstrating email history or creating mock email conversations.

## Features

- **Add Emails**: Create new emails with custom sender, recipient, subject, and message
- **Edit Emails**: Modify any existing email
- **Delete Emails**: Remove emails individually or in bulk
- **Custom Dates**: Set any date and time for emails (including dates from years ago)
- **Search**: Search through all emails by sender, recipient, subject, or content
- **Filter**: View emails by Inbox, Starred, Sent, or Drafts
- **Star Emails**: Mark important emails with a star
- **Local Storage**: All emails are saved in your browser's local storage

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser

2. **Add a New Email**:
   - Click the "Compose" button
   - Fill in the form:
     - **From**: The sender's email address
     - **To**: The recipient's email address
     - **Subject**: Email subject line
     - **Date & Time**: Choose any date and time (you can set dates from years ago!)
     - **Message**: The email content
   - Click "Send"

3. **Edit an Email**:
   - Hover over an email in the list
   - Click the edit icon (pencil)
   - Modify any fields including the date
   - Click "Send" to save changes

4. **Delete an Email**:
   - Hover over an email and click the delete icon (trash)
   - Or select multiple emails and click the delete button in the toolbar

5. **Set Old Dates**:
   - When creating or editing an email, use the "Date & Time" field
   - You can select any date from the past
   - The email will appear in the list sorted by date

6. **Search Emails**:
   - Use the search box at the top to search by sender, recipient, subject, or content

7. **Filter Emails**:
   - Click on "Inbox", "Starred", "Sent", or "Drafts" in the sidebar to filter emails

## Tips

- To show emails from years ago, simply set the date to a past date when creating or editing
- All emails are automatically sorted by date (newest first)
- Emails are saved in your browser's local storage, so they persist between sessions
- You can star important emails by clicking the star icon
- Use the select all checkbox to select multiple emails for bulk operations

## Technical Details

- Pure HTML, CSS, and JavaScript (no dependencies)
- Uses Google Material Icons for the UI
- Responsive design that works on desktop and mobile
- Data stored in browser localStorage
