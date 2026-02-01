import React, { useState } from 'react';
interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  isDraft: boolean;
  attachments?: string[];
}
const emails: Email[] = [
  {
    id: 'draft-1',
    from: 'jsmith@company.com',
    to: 'sarah@company.com',
    subject: 'RE: Security Breach - URGENT',
    date: '03/14/2005 08:45 PM',
    body: `Sarah,
I found something concerning in the logs. Someone accessed the server using admin_backup credentials on the night of March 12th.
The password for the encrypted files is: March2005
DO NOT share this with anyone else. I've stored evidence on my USB drive.
We need to meet tomorrow to discuss next steps.
-John
P.S. Remember the system restore point from that day - it shows the original files before they were modified.`,
    isDraft: true,
    attachments: ['access_log_summary.txt'],
  },
  {
    id: 'draft-2',
    from: 'jsmith@company.com',
    to: 'it-security@company.com',
    subject: 'Incident Report - March 12',
    date: '03/13/2005 11:30 AM',
    body: `Team,
This is a preliminary report of the security incident:
Date: March 12, 2005
Time: Approximately 10:15 PM - 10:20 PM
Affected Systems: Main server (192.168.1.105)
Summary:
- Unauthorized access detected
- User: admin_backup
- Files accessed and copied
Next Steps:
1. Review restore points
2. Check recycle bin for deleted logs
3. Analyze USB evidence
This email will be deleted once official report is filed.
-J`,
    isDraft: true,
  },
  {
    id: 'inbox-1',
    from: 'sarah@company.com',
    to: 'jsmith@company.com',
    subject: 'Security Breach - URGENT',
    date: '03/13/2005 09:00 AM',
    body: `John,
I noticed some strange activity in the access logs from two nights ago. Can you look into this?
Also, have you changed your password recently? The system is showing multiple failed login attempts.
Let me know what you find.
-Sarah`,
    isDraft: false,
  },
  {
    id: 'inbox-2',
    from: 'admin@company.com',
    to: 'all@company.com',
    subject: 'Password Reset Required',
    date: '03/10/2005 02:00 PM',
    body: `All employees,
Please reset your passwords by end of week. Use the following format:
- At least 8 characters
- Include numbers and special characters
- Hint: Use a memorable date
Thank you,
IT Department`,
    isDraft: false,
  },
];
export function YahooMail() {
  const [selectedFolder, setSelectedFolder] = useState('drafts');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const folders = [
    { id: 'inbox', name: 'Inbox', count: 2 },
    { id: 'drafts', name: 'Drafts', count: 2 },
    { id: 'sent', name: 'Sent' },
    { id: 'trash', name: 'Trash' },
  ];
  const filteredEmails = emails.filter((e) => {
    if (selectedFolder === 'drafts') return e.isDraft;
    if (selectedFolder === 'inbox') return !e.isDraft;
    return false;
  });
  return (
    <div className="flex flex-col h-full">
      {/* Yahoo Header */}
      <div className="xp-yahoo-header flex items-center gap-4">
        <div className="text-2xl font-bold">YAHOO!</div>
        <div className="text-sm">Mail</div>
        <div className="ml-auto text-xs">Welcome, jsmith@company.com</div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="xp-yahoo-sidebar">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`xp-yahoo-folder ${selectedFolder === folder.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedFolder(folder.id);
                setSelectedEmail(null);
              }}
            >
              {folder.name}
              {folder.count && <span className="ml-auto">({folder.count})</span>}
            </div>
          ))}
        </div>
        {/* Email List / Content */}
        <div className="flex-1 flex flex-col bg-white">
          {!selectedEmail ? (
            <>
              <div className="p-2 bg-gray-100 border-b text-sm font-bold">
                {selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)}
              </div>
              <div className="xp-yahoo-email-list">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className="xp-yahoo-email-item"
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{email.from}</span>
                      <span className="text-gray-500">{email.date}</span>
                    </div>
                    <div className="font-bold text-sm">{email.subject}</div>
                    <div className="text-xs text-gray-600 truncate">
                      {email.body.substring(0, 80)}...
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-gray-100 border-b flex items-center gap-2">
                <button
                  className="xp-button text-xs"
                  onClick={() => setSelectedEmail(null)}
                >
                  ← Back
                </button>
                {selectedEmail.isDraft && (
                  <span className="text-xs text-orange-600 font-bold">[DRAFT]</span>
                )}
              </div>
              <div className="p-4 overflow-auto flex-1">
                <h2 className="text-lg font-bold mb-2">{selectedEmail.subject}</h2>
                <div className="text-xs mb-1">
                  <span className="text-gray-600">From:</span> {selectedEmail.from}
                </div>
                <div className="text-xs mb-1">
                  <span className="text-gray-600">To:</span> {selectedEmail.to}
                </div>
                <div className="text-xs mb-4">
                  <span className="text-gray-600">Date:</span> {selectedEmail.date}
                </div>
                {selectedEmail.attachments && (
                  <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    📎 Attachments: {selectedEmail.attachments.join(', ')}
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm border-t pt-4">
                  {selectedEmail.body}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}