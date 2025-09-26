
import React from 'react';
import { X, MapPin, Clock, DollarSign, Key, Sparkles } from 'lucide-react';
import { useJobs } from '../contexts/JobContext';
import type { Job } from '../utils/seedData';

interface JobDetailsModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, isOpen, onClose }) => {
  const { acceptJob, state } = useJobs();
  const { loading } = state;

  if (!isOpen) return null;

  const handleAccept = () => {
    if (loading) return;
    acceptJob(job.id);
    onClose();
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
      <Icon size={18} className="text-text-tertiary mt-1" />
      <div>
        <p className="text-sm font-semibold text-text-secondary">{label}</p>
        <p className="text-base text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl w-full max-w-[414px] mx-auto max-h-[calc(90vh-88px)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-card-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple flex items-center justify-center">
              <Sparkles className="text-white" size={20}/>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{job.serviceType}</h2>
              <p className="text-sm text-text-secondary">Job Details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-text-secondary hover:bg-[rgba(255,255,255,0.15)]">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <InfoRow icon={MapPin} label="Location" value={job.customer.location} />
          <InfoRow icon={Clock} label="Date & Time" value={job.dateTime} />
          <InfoRow icon={Key} label="Access Details" value={job.access} />
          <InfoRow icon={DollarSign} label="Estimated Pay" value={`$${job.price}` + (job.tip ? ` + $${job.tip} tip` : '')} />
        </div>

        {/* Footer Actions */}
        {job.status === 'available' && (
          <div className="p-6 border-t border-card-border mt-auto">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="flex-1 py-3 px-6 rounded-md bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)] font-semibold text-sm transition-all duration-300 hover:bg-[rgba(255,255,255,0.15)]">
                Not Interested
              </button>
              <button onClick={handleAccept} disabled={loading} className="flex-1 py-3 px-6 rounded-md bg-green text-white font-semibold text-sm shadow-green-glow transition-all duration-300 hover:shadow-lg hover:shadow-green-glow/50 disabled:opacity-50">
                {loading ? 'Accepting...' : 'Accept Job'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
