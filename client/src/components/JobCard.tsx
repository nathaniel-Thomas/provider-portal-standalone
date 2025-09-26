import {
  Clock, MapPin, Key, DollarSign, Sparkles, Phone, Play, Eye,
  Calendar as CalendarIcon, CheckCircle
} from 'lucide-react';
import { useJobs } from '../contexts/JobContext';
import { useJobWorkflow } from '../contexts/JobWorkflowContext';
import type { Job } from '../utils/seedData';

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
}

const JobCard = ({ job, onViewDetails }: JobCardProps) => {
  const { acceptJob, state } = useJobs();
  const { loading } = state;
  const { setJobId, setIsWorkflowActive } = useJobWorkflow();

  const handleAccept = () => {
    if (loading) return;
    acceptJob(job.id);
  }

  const handleStartJob = () => {
    setJobId(job.id);
    setIsWorkflowActive(true);
  }

  const AvailableCard = () => (
    <div className="relative glass-card p-6 rounded-xl transition-all duration-300 hover:bg-[rgba(255,255,255,0.12)] hover:-translate-y-1">
      {job.isUrgent ? 
        <div className="absolute top-5 right-5 bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.3)] text-[#f87171] text-xs font-semibold px-3 py-1 rounded-full">Urgent</div> :
        <div className="absolute top-5 right-5 bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.3)] text-[#a78bfa] text-xs font-semibold px-3 py-1 rounded-full">{job.distance}</div>
      }
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple flex items-center justify-center"><Sparkles className="text-white" size={20}/></div>
        <div>
          <h3 className="font-bold text-white text-base">{job.serviceType}</h3>
          <p className="text-sm text-text-secondary">{job.customer.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div className="flex items-center gap-2"><MapPin size={16} className="text-text-tertiary" /><span className="text-text-secondary">{job.customer.location}</span></div>
        <div className="flex items-center gap-2"><Clock size={16} className="text-text-tertiary" /><span className="text-text-secondary">{job.dateTime}</span></div>
        <div className="flex items-center gap-2"><Key size={16} className="text-text-tertiary" /><span className="text-text-secondary">{job.access}</span></div>
        <div className="flex items-center gap-2"><DollarSign size={16} className="text-text-tertiary" /><span className="text-text-secondary">Est. ${job.price} {job.tip ? `+ $${job.tip} tip` : ''}</span></div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleAccept} disabled={loading} className="flex-1 py-3 px-6 rounded-md bg-green text-white font-semibold text-sm shadow-green-glow transition-all duration-300 hover:shadow-lg hover:shadow-green-glow/50 disabled:opacity-50">
          {loading ? 'Accepting...' : 'Accept'}
        </button>
        <button onClick={() => onViewDetails(job.id)} className="flex-1 py-3 px-6 rounded-md bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)] font-semibold text-sm transition-all duration-300 hover:bg-[rgba(255,255,255,0.15)]">View Details</button>
      </div>
    </div>
  );

  const ScheduledCard = () => (
    <div className="relative glass-card p-6 rounded-xl border-l-4 border-purple">
        <div className="absolute top-5 right-5 bg-[rgba(102,126,234,0.2)] border border-[rgba(102,126,234,0.3)] text-[#a5b4fc] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Scheduled</div>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center"><CalendarIcon className="text-purple" size={20}/></div>
            <div>
                <h3 className="font-bold text-white text-base">{job.serviceType}</h3>
                <p className="text-sm text-text-secondary">{job.customer.name}</p>
            </div>
        </div>
        <div className="text-sm mb-6 bg-background/50 p-3 rounded-md">
            <div className="flex items-center gap-2"><Clock size={16} className="text-orange" /><span className="font-semibold text-white">{job.dateTime}</span></div>
        </div>
        <div className="flex items-center gap-4">
            <button className="flex-1 py-3 px-6 rounded-md bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)] font-semibold text-sm">Contact</button>
            <button onClick={handleStartJob} className="flex-1 py-3 px-6 rounded-md bg-purple text-white font-semibold text-sm shadow-purple-glow">Start Job</button>
        </div>
    </div>
  );

  const CompletedCard = () => (
    <div className="relative glass-card p-6 rounded-xl border-l-4 border-green">
        <div className="absolute top-5 right-5 bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.3)] text-[#34d399] text-xs font-semibold px-3 py-1 rounded-full">+{job.earnings ? `$${job.earnings}` : ''}</div>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center"><CheckCircle className="text-green" size={20}/></div>
            <div>
                <h3 className="font-bold text-white text-base">{job.serviceType}</h3>
                <p className="text-sm text-text-secondary">{job.customer.name}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div className="flex items-center gap-2"><Clock size={16} className="text-text-tertiary" /><span className="text-text-secondary">{job.duration}</span></div>
        </div>
        <div className="flex items-center gap-4">
            <button className="flex-1 py-3 px-6 rounded-md bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)] font-semibold text-sm">View Work</button>
        </div>
    </div>
  );

  switch (job.status) {
    case 'available':
      return <AvailableCard />;
    case 'scheduled':
      return <ScheduledCard />;
    case 'completed':
      return <CompletedCard />;
    default:
      return null;
  }
};

export default JobCard;