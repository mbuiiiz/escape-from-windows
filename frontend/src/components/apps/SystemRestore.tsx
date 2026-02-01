import React, { useState } from 'react';
interface SystemRestoreProps {
  windowId: string;
  props?: Record<string, unknown>;
}
const restorePoints = [
  {
    date: '03/14/2005 06:00 PM',
    type: 'System Checkpoint',
    description: 'Automatic checkpoint before shutdown',
    changes: [
      { file: 'passwords_backup.txt', action: 'Deleted', location: 'C:\\Documents' },
      { file: 'todo_list.txt', action: 'Modified', location: 'C:\\Documents' },
    ],
  },
  {
    date: '03/13/2005 09:00 AM',
    type: 'Manual Checkpoint',
    description: 'Created after security review',
    changes: [
      { file: 'access_log_031205.txt', action: 'Deleted', location: 'C:\\Logs' },
      { file: 'incident_report_draft.doc', action: 'Created', location: 'C:\\Documents' },
    ],
  },
  {
    date: '03/12/2005 06:00 PM',
    type: 'System Checkpoint',
    description: 'Before security incident',
    changes: [
      { file: 'data.enc', action: 'Original state', location: 'C:\\Secret' },
      { file: 'access_log.txt', action: 'Last clean version', location: 'C:\\Logs' },
    ],
  },
  {
    date: '03/10/2005 12:00 PM',
    type: 'Program Installation',
    description: 'Security update installed',
    changes: [
      { file: 'firewall.exe', action: 'Updated', location: 'C:\\Windows\\System32' },
      { file: 'security.dll', action: 'Modified', location: 'C:\\Windows\\System32' },
    ],
  },
  {
    date: '03/01/2005 10:00 AM',
    type: 'System Checkpoint',
    description: 'Monthly backup checkpoint',
    changes: [
      { file: 'passwords_backup.txt', action: 'Created', location: 'C:\\Documents' },
      { file: 'user_data.db', action: 'Original state', location: 'C:\\Data' },
    ],
  },
];
export function SystemRestore({ windowId, props }: SystemRestoreProps) {
  const [step, setStep] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const renderStep0 = () => (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Welcome to System Restore</h2>
      <p className="text-sm mb-4">
        System Restore can help you restore your computer to an earlier state
        without losing personal files like documents, pictures, or e-mail.
      </p>
      <p className="text-sm mb-4">
        System Restore periodically creates restore points to which you can
        return your computer.
      </p>
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
        <strong>🔍 Investigation Tip:</strong> Review restore points to see which
        files were modified before and after the security incident on March 12, 2005.
      </div>
    </div>
  );
  const renderStep1 = () => (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Select a Restore Point</h2>
      <p className="text-sm mb-4">
        The following restore points are available. Click on a date to see what
        files were changed.
      </p>
      <div className="border border-gray-300 rounded max-h-60 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left p-2 border-b">Date</th>
              <th className="text-left p-2 border-b">Type</th>
              <th className="text-left p-2 border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {restorePoints.map((point, i) => (
              <tr
                key={i}
                className={`cursor-pointer ${
                  selectedPoint === i ? 'bg-blue-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPoint(i)}
              >
                <td className="p-2 border-b">{point.date}</td>
                <td className="p-2 border-b">{point.type}</td>
                <td className="p-2 border-b">{point.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPoint !== null && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-sm mb-2">
            Files changed at this restore point:
          </h3>
          <ul className="text-xs space-y-1">
            {restorePoints[selectedPoint].changes.map((change, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className={`font-bold ${
                    change.action === 'Deleted'
                      ? 'text-red-600'
                      : change.action === 'Modified'
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}
                >
                  [{change.action}]
                </span>
                <span>{change.file}</span>
                <span className="text-gray-500">- {change.location}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="w-40 p-4 flex flex-col items-center justify-start"
        style={{
          background: 'linear-gradient(180deg, hsl(210 100% 45%) 0%, hsl(210 100% 35%) 100%)',
        }}
      >
        <img
          src="/xp-icons/system-restore.png"
          alt="System Restore"
          className="w-16 h-16 mb-4"
        />
        <div className="text-white text-center text-xs">
          System Restore
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col bg-white">
        {step === 0 && renderStep0()}
        {step === 1 && renderStep1()}
        {/* Buttons */}
        <div className="mt-auto p-4 border-t flex justify-end gap-2">
          {step > 0 && (
            <button className="xp-button" onClick={() => setStep(step - 1)}>
              &lt; Back
            </button>
          )}
          <button
            className="xp-button"
            onClick={() => setStep(step + 1)}
            disabled={step === 1}
          >
            {step === 0 ? 'Next >' : 'Restore'}
          </button>
          <button className="xp-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}